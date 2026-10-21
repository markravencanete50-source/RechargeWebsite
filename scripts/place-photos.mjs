// Finds a real photograph for each named place in the listings' "nearby" lists, from Wikipedia,
// with the author and licence for the credit line. Generic names ("Gym", "Local supermarket")
// are skipped, and a match is kept only when the article title clearly names the same place.
//
// Run: node --experimental-strip-types scripts/place-photos.mjs   (needs en.wikipedia.org)
// Writes src/content/place-photos.json, keyed "Place name|Town". Re-running keeps earlier matches.
import fs from "node:fs";
import { parseListing } from "../src/content/listing.ts";

const OUT = new URL("../src/content/place-photos.json", import.meta.url);
const homes = JSON.parse(fs.readFileSync(new URL("../src/content/properties.json", import.meta.url), "utf8"));
const known = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const API = "https://en.wikipedia.org/w/api.php";
const UA = { "user-agent": "RechargeWebsite/1.0 (https://rechargestays.co.uk; enquiries@rechargestays.co.uk)" };

const GENERIC = /^(the )?(local |nearest )?(gym|gyms|supermarkets?|train station|bus stops?|shops?|shopping|town centre|city centre|quick bites|steps away|commuter friendly|stress-free parking|edinburgh|glasgow)\b/i;
const words = (s) => s.toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !["the", "and", "park", "centre", "station"].includes(w));

async function get(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`;
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

const strip = (html = "") => html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

async function find(name, town) {
  const data = await get({ action: "query", generator: "search", gsrsearch: `${name} ${town} Scotland`, gsrlimit: "5", prop: "pageimages|info", piprop: "thumbnail|name", pithumbsize: "640", inprop: "url" });
  const pages = (data.query?.pages ?? []).sort((a, b) => a.index - b.index);
  const want = words(name.split("/")[0]);
  for (const p of pages) {
    if (!p.thumbnail || !p.pageimage) continue;
    const have = new Set(words(p.title));
    const overlap = want.filter((w) => have.has(w)).length / Math.max(1, want.length);
    if (overlap < 0.6) continue;
    const info = await get({ action: "query", titles: `File:${p.pageimage}`, prop: "imageinfo", iiprop: "extmetadata" });
    const meta = info.query?.pages?.[0]?.imageinfo?.[0]?.extmetadata ?? {};
    const artist = strip(meta.Artist?.value).slice(0, 60);
    const licence = strip(meta.LicenseShortName?.value);
    return { src: p.thumbnail.source, page: p.fullurl, credit: [artist, licence, "Wikimedia Commons"].filter(Boolean).join(", ") };
  }
  return null;
}

const wanted = new Map();
for (const h of homes) {
  for (const p of parseListing(h.description, h.houseRules).places) {
    if (p.name.length < 4 || GENERIC.test(p.name)) continue;
    wanted.set(`${p.name}|${h.town}`, [p.name, h.town]);
  }
}

let found = 0;
for (const [key, [name, town]] of wanted) {
  if (known[key]) { found++; continue; }
  try {
    const hit = await find(name, town);
    if (hit) { known[key] = hit; found++; console.log("ok  ", key, "->", hit.page); }
    else console.log("none", key);
  } catch (e) {
    console.log("fail", key, e.message);
  }
  await new Promise((r) => setTimeout(r, 200));
}
fs.writeFileSync(OUT, JSON.stringify(known, null, 1) + "\n");
console.log(`${found} of ${wanted.size} places have a photo`);
