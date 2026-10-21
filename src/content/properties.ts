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

export const homes = data as Home[];
export const homeBySlug = (slug: string) => homes.find((h) => h.slug === slug);

// Regions, biggest first, for the search and the filters.
export const regions = Object.entries(homes.reduce<Record<string, number>>((acc, h) => ({ ...acc, [h.region]: (acc[h.region] ?? 0) + 1 }), {}))
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({ name, count }));

// The homes shown first: those with photos, then the most stayed in.
export const featured = [...homes].sort((a, b) => Number(!!b.photos[0]?.src) - Number(!!a.photos[0]?.src) || b.reviews - a.reviews);

// Price steps for the filters, from the cheapest to the dearest home that has a price.
const prices = homes.map((h) => h.price).filter((p): p is number => typeof p === "number").sort((a, b) => a - b);
const STEPS = [40, 50, 60, 75, 100, 125, 150, 200, 250, 300, 400, 500];
export const priceSteps = prices.length ? STEPS.filter((s) => s >= Math.floor(prices[0] / 10) * 10 && s <= prices[prices.length - 1] + 50) : STEPS.slice(1, 9);
export const money = (n: number, currency = "GBP") => new Intl.NumberFormat("en-GB", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

export function distance(m: number) {
  const walk = Math.round(m / 80);
  if (m < 1000) return `${Math.max(50, Math.round(m / 10) * 10)} m, ${Math.max(1, walk)} min walk`;
  const km = (m / 1000).toFixed(m < 10000 ? 1 : 0);
  return m <= 2000 ? `${km} km, ${walk} min walk` : `${km} km`;
}
