// Build src/content/properties.json, the homes shown on the website.
//
//   node scripts/import-properties.mjs            Hostaway listings + OpenStreetMap nearby places
//   node scripts/import-properties.mjs --offline  only the portfolio list (no network), for a first build
//
// Sources:
// - scripts/portfolio.json: the active homes from the Recharge platform (Hostaway id, region, town,
//   postcode district, bedrooms, review count). Exact addresses are deliberately not stored here.
// - Hostaway (HOSTAWAY_ACCOUNT_ID, HOSTAWAY_API_KEY): each listing's public title, description,
//   amenities, photos, capacity, check-in and check-out times and map position.
// - OpenStreetMap (Overpass API): the nearest station, bus stop, supermarket, pharmacy, park,
//   restaurant and attraction to each home, with straight-line distances.
//
// Nothing is made up: a field Hostaway or OpenStreetMap does not have is left out, and the page hides it.
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url);
const OFFLINE = process.argv.includes("--offline");
const HOSTAWAY = "https://api.hostaway.com/v1";
const OVERPASS = "https://overpass-api.de/api/interpreter";
const portfolio = JSON.parse(readFileSync(new URL("scripts/portfolio.json", ROOT), "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").slice(0, 70);
const clean = (s) => (typeof s === "string" ? s.replace(/\r/g, "").trim() : "");

async function hostawayToken() {
  const { HOSTAWAY_ACCOUNT_ID: id, HOSTAWAY_API_KEY: key } = process.env;
  if (!id || !key) throw new Error("Set HOSTAWAY_ACCOUNT_ID and HOSTAWAY_API_KEY (or run with --offline).");
  const res = await fetch(`${HOSTAWAY}/accessTokens`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "cache-control": "no-cache" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: key, scope: "general" }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) throw new Error(`Hostaway sign-in failed (${res.status})`);
  await sleep(1100);
  return body.access_token;
}

async function hostawayListings(token) {
  const all = [];
  for (let offset = 0; ; offset += 100) {
    const res = await fetch(`${HOSTAWAY}/listings?limit=100&offset=${offset}&includeResources=1`, { headers: { authorization: `Bearer ${token}`, "cache-control": "no-cache" } });
    const body = await res.json();
    if (!res.ok || body.status === "fail") throw new Error(`Hostaway listings failed (${res.status})`);
    all.push(...body.result);
    if (body.result.length < 100) return all;
  }
}

// Nearby places from OpenStreetMap, nearest of each kind within a radius.
const KINDS = [
  { key: "station", label: "Train station", query: 'nwr["railway"="station"]', radius: 5000 },
  { key: "bus", label: "Bus stop", query: 'node["highway"="bus_stop"]', radius: 1000 },
  { key: "supermarket", label: "Supermarket", query: 'nwr["shop"="supermarket"]', radius: 3000 },
  { key: "pharmacy", label: "Pharmacy", query: 'nwr["amenity"="pharmacy"]', radius: 3000 },
  { key: "restaurant", label: "Restaurant or cafe", query: 'nwr["amenity"~"^(restaurant|cafe)$"]', radius: 2000 },
  { key: "park", label: "Park", query: 'nwr["leisure"="park"]["name"]', radius: 3000 },
  { key: "attraction", label: "Attraction", query: 'nwr["tourism"~"^(attraction|museum|castle|viewpoint)$"]["name"]', radius: 8000 },
  { key: "airport", label: "Airport", query: 'nwr["aeroway"="aerodrome"]["iata"]', radius: 60000 },
];
const metres = (a, b) => {
  const R = 6371000, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
};
async function nearby(at) {
  const q = `[out:json][timeout:60];(${KINDS.map((k) => `${k.query}(around:${k.radius},${at.lat},${at.lng});`).join("")});out center tags;`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(OVERPASS, { method: "POST", body: new URLSearchParams({ data: q }), headers: { "user-agent": "rechargestays.co.uk property import" } });
    if (res.status === 429 || res.status === 504) { await sleep(5000 * (attempt + 1)); continue; }
    if (!res.ok) throw new Error(`Overpass failed (${res.status})`);
    const { elements } = await res.json();
    const out = [];
    for (const k of KINDS) {
      const matches = elements.filter((e) => {
        const t = e.tags || {};
        if (k.key === "station") return t.railway === "station";
        if (k.key === "bus") return t.highway === "bus_stop";
        if (k.key === "supermarket") return t.shop === "supermarket";
        if (k.key === "pharmacy") return t.amenity === "pharmacy";
        if (k.key === "restaurant") return t.amenity === "restaurant" || t.amenity === "cafe";
        if (k.key === "park") return t.leisure === "park" && t.name;
        if (k.key === "attraction") return /^(attraction|museum|castle|viewpoint)$/.test(t.tourism || "") && t.name;
        if (k.key === "airport") return t.aeroway === "aerodrome" && t.iata;
        return false;
      }).map((e) => ({ name: e.tags.name || "", distance: metres(at, { lat: e.lat ?? e.center?.lat, lng: e.lon ?? e.center?.lon }) }))
        .filter((m) => Number.isFinite(m.distance)).sort((a, b) => a.distance - b.distance);
      if (matches[0]) out.push({ kind: k.key, label: k.label, name: matches[0].name, metres: matches[0].distance });
    }
    return out;
  }
  return [];
}

function fromHostaway(home, l) {
  const title = clean(l.externalListingName) || clean(l.airbnbName) || clean(l.name);
  const photos = (l.listingImages || []).slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((img) => ({ src: img.url, alt: clean(img.caption) || `${title}, ${home.town}` })).filter((p) => p.src);
  const amenities = [...new Set((l.listingAmenities || []).map((a) => clean(a.amenityName)).filter(Boolean))];
  return {
    title,
    description: clean(l.description),
    houseRules: clean(l.houseRules) || undefined,
    guests: l.personCapacity || undefined,
    bedrooms: l.bedroomsNumber ?? home.bedrooms,
    beds: l.bedsNumber || undefined,
    bathrooms: l.bathroomsNumber || undefined,
    checkIn: l.checkInTimeStart != null ? `${String(l.checkInTimeStart).padStart(2, "0")}:00` : undefined,
    checkOut: l.checkOutTime != null ? `${String(l.checkOutTime).padStart(2, "0")}:00` : undefined,
    amenities,
    photos,
    at: Number.isFinite(l.lat) && Number.isFinite(l.lng) ? { lat: l.lat, lng: l.lng } : undefined,
  };
}

const listings = new Map();
if (!OFFLINE) {
  const token = await hostawayToken();
  for (const l of await hostawayListings(token)) listings.set(Number(l.id), l);
  console.log(`Hostaway: ${listings.size} listings`);
}

const used = new Set();
const homes = [];
for (const home of portfolio) {
  const l = listings.get(home.hostawayId);
  if (!OFFLINE && !l) console.warn(`Not in Hostaway: ${home.hostawayId} (${home.town})`);
  const data = l ? fromHostaway(home, l) : { title: `${home.bedrooms}-bedroom home in ${home.town}`, bedrooms: home.bedrooms, amenities: [], photos: [] };
  let slug = slugify(`${data.title.split("|")[0]} ${home.town}`.replace(new RegExp(`(${home.town}).*\\1`, "i"), "$1"));
  while (used.has(slug)) slug += "-2";
  used.add(slug);
  const entry = { slug, hostawayId: home.hostawayId, region: home.region, town: home.town, district: home.district, reviews: home.reviews, ...data };
  if (!OFFLINE && data.at) {
    try { entry.nearby = await nearby(data.at); } catch (e) { console.warn(`Nearby failed for ${slug}: ${e.message}`); }
    await sleep(1200);
  }
  delete entry.at;
  homes.push(entry);
  process.stdout.write(`\r${homes.length}/${portfolio.length}`);
}
writeFileSync(new URL("src/content/properties.json", ROOT), JSON.stringify(homes, null, 1) + "\n");
console.log(`\nWrote ${homes.length} homes to src/content/properties.json`);
