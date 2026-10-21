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

export function distance(m: number) {
  const walk = Math.round(m / 80);
  if (m < 1000) return `${Math.max(50, Math.round(m / 10) * 10)} m, ${Math.max(1, walk)} min walk`;
  const km = (m / 1000).toFixed(m < 10000 ? 1 : 0);
  return m <= 2000 ? `${km} km, ${walk} min walk` : `${km} km`;
}
