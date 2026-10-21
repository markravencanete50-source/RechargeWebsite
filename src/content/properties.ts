// The homes on the website, built by scripts/import-properties.mjs from the Recharge platform's
// portfolio, Hostaway (titles, descriptions, amenities, photos) and OpenStreetMap (nearby places).
// Rebuild it with `node scripts/import-properties.mjs`; never edit properties.json by hand.
import data from "./properties.json";

export type Photo = { src: string | null; alt: string };
export type Nearby = { kind: string; label: string; name: string; metres: number };
export type Home = {
  slug: string;
  hostawayId: number;
  region: string;
  town: string;
  district: string;
  reviews: number;
  title: string;
  description?: string;
  houseRules?: string;
  guests?: number;
  bedrooms: number;
  beds?: number;
  bathrooms?: number;
  // Typical nightly price: the median rate in the Hostaway calendar over the next 60 days. Dates can
  // cost more or less; the booking site has the exact total.
  price?: number;
  currency?: string;
  checkIn?: string;
  checkOut?: string;
  amenities: string[];
  photos: Photo[];
  nearby?: Nearby[];
  // Scottish short-term let licence number. Must show on every listing once known.
  licence?: string;
  bookingUrl?: string;
};

// Hostaway mixes "Hair Dryer" and "Hair dryer"; show every amenity in sentence case.
const sentence = (a: string) =>
  (a.charAt(0) + a.slice(1).replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase())).replace(/\bwi-?fi\b/gi, "Wi-Fi").replace(/\bnetflix\b/gi, "Netflix");

export const homes = (data as Home[]).map((h) => ({ ...h, amenities: [...new Set(h.amenities.map(sentence))] }));
export const homeBySlug = (slug: string) => homes.find((h) => h.slug === slug);

// Regions, biggest first, for the search and the filters.
export const regions = Object.entries(homes.reduce<Record<string, number>>((acc, h) => ({ ...acc, [h.region]: (acc[h.region] ?? 0) + 1 }), {}))
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({ name, count }));

export const regionSlug = (region: string) => region.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const regionBySlug = (slug: string) => regions.find((r) => regionSlug(r.name) === slug);
export const reviewTotal = homes.reduce((n, h) => n + h.reviews, 0);

// The homes shown first: those with photos, then the most stayed in.
export const featured = [...homes].sort((a, b) => Number(!!b.photos[0]?.src) - Number(!!a.photos[0]?.src) || b.reviews - a.reviews);

// Price steps for the filters, from the cheapest to the dearest home that has a price.
const prices = homes.map((h) => h.price).filter((p): p is number => typeof p === "number").sort((a, b) => a - b);
const STEPS = [40, 50, 60, 75, 100, 125, 150, 200, 250, 300, 400, 500];
export const priceSteps = prices.length ? STEPS.filter((s) => s >= Math.floor(prices[0] / 10) * 10 && s <= prices[prices.length - 1] + 50) : STEPS.slice(1, 9);
export const money = (n: number, currency = "GBP") => new Intl.NumberFormat("en-GB", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

// A clean heading from the facts, such as "2-bedroom flat in Glasgow". Hostaway titles are
// Airbnb keyword strings ("Free Parking | Central | Sleeps 6"), so those become tags instead.
export function heading(h: Home) {
  const t = h.title.toLowerCase();
  const kind = /cottage/.test(t) ? "cottage" : /bungalow/.test(t) ? "bungalow" : /\bhouse\b/.test(t) ? "house" : /flat|apartment|basement/.test(t) ? "flat" : "home";
  return h.bedrooms > 0 ? `${h.bedrooms}-bedroom ${kind} in ${h.town}` : `Studio ${kind === "home" ? "flat" : kind} in ${h.town}`;
}

// The useful selling points in a Hostaway title, worded the same way everywhere. Counts of guests
// and bedrooms are left out (the page shows them), and so are adjectives on their own.
const TAGS: [RegExp, string][] = [
  [/free parking/i, "Free parking"],
  [/^parking$/i, "Parking"],
  [/city cent(re|er)/i, "City centre"],
  [/^central$|modern & central|central & modern/i, "Central"],
  [/(great|prime|excellent|nice|lovely) (location|area)/i, "Great location"],
  [/transport/i, "Great transport links"],
  [/airport/i, "Near the airport"],
  [/hampden/i, "Near Hampden Park"],
  [/seton sands/i, "Near Seton Sands"],
  [/views?\b/i, "Great views"],
  [/new interior|renovated|refurbished|newly furnished/i, "Newly refurbished"],
  [/peaceful/i, "Peaceful"],
];
export function tags(h: Home) {
  const out: string[] = [];
  for (const part of h.title.split("|").map((p) => p.trim())) {
    const tag = TAGS.find(([re]) => re.test(part))?.[1];
    if (tag && !out.includes(tag) && !(tag === "Parking" && out.includes("Free parking"))) out.push(tag);
  }
  return out.filter((t) => !(t === "Parking" && out.includes("Free parking")));
}

export function distance(m: number) {
  const walk = Math.round(m / 80);
  if (m < 1000) return `${Math.max(50, Math.round(m / 10) * 10)} m, ${Math.max(1, walk)} min walk`;
  const km = (m / 1000).toFixed(m < 10000 ? 1 : 0);
  return m <= 2000 ? `${km} km, ${walk} min walk` : `${km} km`;
}
