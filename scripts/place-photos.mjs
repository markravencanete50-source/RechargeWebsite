// Finds a real photograph for each named place in the listings' "nearby" lists, from Wikipedia,
// with the author and licence for the credit line, and saves them so the page does not have to
// look them up in the visitor's browser. The matching rules live in src/lib/place-photo.ts.
//
// Run: node --experimental-strip-types scripts/place-photos.mjs   (needs en.wikipedia.org)
// Writes src/content/place-photos.json, keyed "Place name|Town". Re-running keeps earlier matches.
import fs from "node:fs";
import { parseListing } from "../src/content/listing.ts";
import { findPlacePhoto, wantsPhoto } from "../src/lib/place-photo.ts";

const OUT = new URL("../src/content/place-photos.json", import.meta.url);
const homes = JSON.parse(fs.readFileSync(new URL("../src/content/properties.json", import.meta.url), "utf8"));
const known = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const UA = { "user-agent": "RechargeWebsite/1.0 (https://rechargestays.co.uk; enquiries@rechargestays.co.uk)" };
const get = async (u) => { const r = await fetch(u, { headers: UA }); if (!r.ok) throw new Error(String(r.status)); return r.json(); };

const wanted = new Map();
for (const h of homes) {
  for (const p of parseListing(h.description, h.houseRules).places) if (wantsPhoto(p.name)) wanted.set(`${p.name}|${h.town}`, [p.name, h.town]);
}

let found = 0;
for (const [key, [name, town]] of wanted) {
  if (known[key]) { found++; continue; }
  try {
    const hit = await findPlacePhoto(name, town, get);
    if (hit) { known[key] = hit; found++; console.log("ok  ", key, "->", hit.page); }
    else console.log("none", key);
  } catch (e) {
    console.log("fail", key, e.message);
  }
  await new Promise((r) => setTimeout(r, 200));
}
fs.writeFileSync(OUT, JSON.stringify(known, null, 1) + "\n");
console.log(`${found} of ${wanted.size} places have a photo`);
