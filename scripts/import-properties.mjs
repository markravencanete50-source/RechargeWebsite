// Build src/content/properties.json, the homes shown on the website.
//
//   node scripts/import-properties.mjs            Hostaway listings + OpenStreetMap nearby places
//   node scripts/import-properties.mjs --offline  only the portfolio list (no network), for a first build
//
// Nearby places already in properties.json are kept (Overpass is slow and rate limited), so a re-run
// only looks up homes that have none. Add --refresh-nearby to look them all up again, or
// --skip-nearby to refresh only the Hostaway data.
//
// Sources:
// - scripts/portfolio.json: the active homes from the Recharge platform (Hostaway id, region, town,
//   postcode district, bedrooms, review count). Exact addresses are deliberately not stored here.
// - Hostaway (HOSTAWAY_ACCOUNT_ID, HOSTAWAY_API_KEY): each listing's public title, description,
//   amenities, photos, capacity, check-in and check-out times, nightly price, licence number and map position.
//   The price is the median nightly rate in the Hostaway calendar over the next 60 days; the listing's
//   base price is a placeholder (often 500, 1000 or 5000) and is not used.
//   A listing without a real map position (Hostaway's default is the centre of the UK) is placed by
//   its postcode with OpenStreetMap Nominatim. Neither the position nor the postcode is stored.
// - OpenStreetMap (Overpass API): the nearest station, bus stop, supermarket, pharmacy, park,
//   restaurant and attraction to each home, with straight-line distances.
//
// Nothing is made up: a field Hostaway or OpenStreetMap does not have is left out, and the page hides it.
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const ROOT = new URL("../", import.meta.url);
const OFFLINE = process.argv.includes("--offline");
const REFRESH_NEARBY = process.argv.includes("--refresh-nearby");
const HOSTAWAY = "https://api.hostaway.com/v1";
const OVERPASS = "https://overpass-api.de/api/interpreter";
const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "rechargestays.co.uk property import";
const portfolio = JSON.parse(readFileSync(new URL("scripts/portfolio.json", ROOT), "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").slice(0, 70);
const clean = (s) => (typeof s === "string" ? s.replace(/\r/g, "").trim() : "");
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Listing text as written in Hostaway, with two changes for the website: no exact street address
// (the street, with any house number, is taken out) and no em dashes.
function scrub(text, l) {
  let out = clean(text);
  const streets = [l.street, String(l.address || "").split(",")[0].replace(/^[\d/]+[a-z]?\s+/i, "")].map(clean).filter((s) => s.length > 3);
  for (const street of new Set(streets)) {
    const name = escape(street).replace(/\\?\.?$/, "").replace(/(Street|St)$/i, "(?:Street|St)\\.?").replace(/(Road|Rd)$/i, "(?:Road|Rd)\\.?");
    const num = "(?:[\\d/]+[a-z]?,?\\s+)?";
    out = out.replace(new RegExp(`\\s+(?:at|on|in)\\s+${num}${name}(?!\\w)`, "gi"), "");
    out = out.replace(new RegExp(`${num}\\b${name}(?!\\w)`, "gi"), "the street");
  }
  return out.replace(/^[ \t]*—[ \t]*/gm, "- ").replace(/\s*—\s*/g, ", ");
}

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
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(OVERPASS, { method: "POST", body: new URLSearchParams({ data: q }), headers: { "user-agent": USER_AGENT }, signal: AbortSignal.timeout(90000) });
    if ([429, 502, 503, 504].includes(res.status)) { await sleep(10000 * (attempt + 1)); continue; }
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
  throw new Error("Overpass busy after 6 tries");
}

// Where a listing is. Hostaway's default for a listing without a pin is the centre of the UK.
async function position(l) {
  const placeholder = Math.abs(l.lat - 55.378051) < 0.001 && Math.abs(l.lng + 3.435973) < 0.001;
  if (Number.isFinite(l.lat) && Number.isFinite(l.lng) && !placeholder) return { lat: l.lat, lng: l.lng };
  if (!clean(l.zipcode)) return undefined;
  await sleep(1100);
  const res = await fetch(`${NOMINATIM}?${new URLSearchParams({ postalcode: clean(l.zipcode), countrycodes: "gb", format: "json", limit: "1" })}`, { headers: { "user-agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Nominatim failed (${res.status})`);
  const [hit] = await res.json();
  return hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : undefined;
}

// Marketing tiles made for booking sites: text on the Recharge teal (nearby lists, features, screenshots
// of guest reviews with star ratings). Captions are mostly file names, so tiles are found by colour:
// in a tile most pixels are that teal, in a photo of a home almost none are (at most 0.2 in practice).
async function isTile(url) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!res.ok) throw new Error(`photo download failed (${res.status})`);
      const { data } = await sharp(Buffer.from(await res.arrayBuffer())).resize(200, 200, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      let teal = 0;
      for (let i = 0; i < data.length; i += 3) if (data[i + 1] - data[i] > 35 && Math.abs(data[i + 1] - data[i + 2]) < 25 && data[i] < 120) teal++;
      return teal / (data.length / 3) > 0.4;
    } catch (e) {
      if (attempt >= 2) throw new Error(`Could not check photo ${url}: ${e.message}`);
      await sleep(2000);
    }
  }
}
async function photosOf(l, title, town) {
  const urls = (l.listingImages || []).slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((img) => img.url).filter(Boolean);
  const tile = [];
  for (let i = 0; i < urls.length; i += 12) tile.push(...await Promise.all(urls.slice(i, i + 12).map(isTile)));
  // Hostaway captions are file names, some with the street in them, so the alt text is the title.
  return urls.filter((u, i) => !tile[i]).map((src) => ({ src, alt: `${title}, ${town}` }));
}

// Median nightly rate over the next 60 days, from the Hostaway calendar.
async function nightlyPrice(token, id) {
  const day = (offset) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);
  await sleep(700);
  const res = await fetch(`${HOSTAWAY}/listings/${id}/calendar?startDate=${day(0)}&endDate=${day(59)}`, { headers: { authorization: `Bearer ${token}`, "cache-control": "no-cache" } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.status === "fail") throw new Error(`Hostaway calendar failed for ${id} (${res.status})`);
  const prices = (body.result || []).map((d) => d.price).filter((p) => Number.isFinite(p) && p > 0).sort((a, b) => a - b);
  return prices.length ? Math.round(prices[Math.floor(prices.length / 2)]) : undefined;
}

// Hostaway amenities that describe the area or the host, not the home.
const NOT_AMENITY = /^(hospital nearby|museums|shopping|theme parks|laundromat|.*emergency contact|wheelchair not accessible|internet)$/i;
// Shown first (cards show the first three), in this order; the rest follow in Hostaway's order.
const FIRST = [/wi-?fi|wireless/i, /free parking|private parking/i, /parking/i, /hot tub/i, /swimming pool/i, /^kitchen$/i, /washing machine/i, /dishwasher/i, /workspace/i, /smart tv|^tv$/i, /garden/i, /balcony/i];
const rank = (a) => { const i = FIRST.findIndex((re) => re.test(a)); return i < 0 ? FIRST.length : i; };

async function fromHostaway(home, l, token) {
  const title = (clean(l.externalListingName) || clean(l.airbnbName) || clean(l.name)).replace(/\s*\|\s*/g, " | ");
  const photos = await photosOf(l, title, home.town);
  let amenities = [...new Set((l.listingAmenities || []).map((a) => clean(a.amenityName)).filter((a) => a && !NOT_AMENITY.test(a)))];
  if (amenities.includes("Free WiFi")) amenities = amenities.filter((a) => a !== "Wireless");
  amenities = amenities.map((a, i) => [a, i]).sort((x, y) => rank(x[0]) - rank(y[0]) || x[1] - y[1]).map(([a]) => a);
  const description = scrub(l.description, l);
  return {
    title,
    description: description || undefined,
    houseRules: scrub(l.houseRules, l) || undefined,
    guests: l.personCapacity || undefined,
    bedrooms: l.bedroomsNumber ?? home.bedrooms,
    beds: l.bedsNumber || undefined,
    bathrooms: l.bathroomsNumber || undefined,
    checkIn: l.checkInTimeStart != null ? `${String(l.checkInTimeStart).padStart(2, "0")}:00` : undefined,
    checkOut: l.checkOutTime != null ? `${String(l.checkOutTime).padStart(2, "0")}:00` : undefined,
    amenities,
    photos,
    licence: clean(l.propertyLicenseNumber) || undefined,
    price: await nightlyPrice(token, l.id),
    currency: clean(l.currencyCode) || undefined,
    at: await position(l),
  };
}

const previous = new Map();
try {
  for (const h of JSON.parse(readFileSync(new URL("src/content/properties.json", ROOT), "utf8"))) if (h.nearby?.length) previous.set(h.hostawayId, h.nearby);
} catch {}
let overpassFailures = process.argv.includes("--skip-nearby") ? Infinity : 0;

const listings = new Map();
let token;
if (!OFFLINE) {
  token = await hostawayToken();
  for (const l of await hostawayListings(token)) listings.set(Number(l.id), l);
  console.log(`Hostaway: ${listings.size} listings`);
}

const used = new Set();
const homes = [];
for (const home of portfolio) {
  const l = listings.get(home.hostawayId);
  if (!OFFLINE && !l) console.warn(`Not in Hostaway: ${home.hostawayId} (${home.town})`);
  const data = l ? await fromHostaway(home, l, token) : { title: `${home.bedrooms}-bedroom home in ${home.town}`, bedrooms: home.bedrooms, amenities: [], photos: [] };
  // Slugs come from bedrooms and town, not the listing title, so links stay put when a title changes.
  const base = slugify(`${data.bedrooms}-bedroom home in ${home.town}`);
  let slug = base;
  for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
  used.add(slug);
  const entry = { slug, hostawayId: home.hostawayId, region: home.region, town: home.town, district: home.district, reviews: home.reviews, ...data };
  if (!REFRESH_NEARBY && previous.has(home.hostawayId)) entry.nearby = previous.get(home.hostawayId);
  else if (!OFFLINE && data.at && overpassFailures < 3) {
    // After three homes in a row fail, Overpass is down or limiting us: stop asking, re-run later.
    try { entry.nearby = await nearby(data.at); overpassFailures = 0; } catch (e) { overpassFailures++; console.warn(`Nearby failed for ${slug}: ${e.message}`); }
    await sleep(1200);
  }
  delete entry.at;
  homes.push(entry);
  process.stdout.write(`\r${homes.length}/${portfolio.length}`);
}
writeFileSync(new URL("src/content/properties.json", ROOT), JSON.stringify(homes, null, 1) + "\n");
console.log(`\nWrote ${homes.length} homes to src/content/properties.json`);
