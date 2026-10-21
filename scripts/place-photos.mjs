// Finds a real photograph for each named place in the listings' "nearby" lists, from Wikipedia,
// with the author and licence for the credit line, and saves them so the page does not have to
// look them up in the visitor's browser. The matching rules live in src/lib/place-photo.ts.
//
// Run: node --experimental-strip-types scripts/place-photos.mjs   (needs en.wikipedia.org)
// Writes src/content/place-photos.json, keyed "Place name|Town". Re-running keeps earlier matches.
import fs from "node:fs";
import { parseListing } from "../src/content/listing.ts";
import { findPlacePhoto, isSamePlace, wantsPhoto } from "../src/lib/place-photo.ts";

// PLACE_PHOTOS_OUT writes somewhere else during a long run, so the repository only changes once it is checked.
const OUT = process.env.PLACE_PHOTOS_OUT ? new URL(`file://${process.env.PLACE_PHOTOS_OUT}`) : new URL("../src/content/place-photos.json", import.meta.url);
const homes = JSON.parse(fs.readFileSync(new URL("../src/content/properties.json", import.meta.url), "utf8"));
const known = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const UA = { "user-agent": "RechargeWebsite/1.0 (https://rechargestays.co.uk; enquiries@rechargestays.co.uk)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Wikipedia rate-limits shared connections: wait as long as it asks, then try again.
async function get(u, tries = 6) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(u, { headers: UA });
    if (r.status === 429 || r.status >= 500) { await sleep((Number(r.headers.get("retry-after")) || 20) * 1000 + 1000); continue; }
    if (!r.ok) throw new Error(String(r.status));
    await sleep(1200);
    return r.json();
  }
  throw new Error("still rate limited");
}

// Earlier matches are re-checked against the current rules; any that fail are looked up again.
for (const [key, v] of Object.entries(known)) {
  const name = key.split("|")[0];
  const title = v ? decodeURIComponent(v.page.split("/wiki/")[1]).replace(/_/g, " ") : "";
  if (!wantsPhoto(name) || (v && !isSamePlace(name, title))) { console.log("drop", key, title); delete known[key]; }
}

const wanted = new Map();
for (const h of homes) {
  for (const p of parseListing(h.description, h.houseRules).places) if (wantsPhoto(p.name)) wanted.set(`${p.name}|${h.town}`, [p.name, h.town]);
}

let found = 0;
for (const [key, [name, town]] of wanted) {
  if (key in known) { if (known[key]) found++; continue; }
  try {
    const hit = await findPlacePhoto(name, town, get);
    if (hit) { known[key] = hit; found++; console.log("ok  ", key, "->", hit.page); }
    else { known[key] = null; console.log("none", key); }
  } catch (e) {
    console.log("fail", key, e.message);
  }
  // Saved as it goes, so a stopped run can carry on where it left off.
  fs.writeFileSync(OUT, JSON.stringify(known, null, 1) + "\n");
}
fs.writeFileSync(OUT, JSON.stringify(known, null, 1) + "\n");
console.log(`${found} of ${wanted.size} places have a photo`);
