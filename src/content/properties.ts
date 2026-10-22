// The homes on the website, built by scripts/import-properties.mjs from the Recharge platform's
// portfolio, Hostaway (titles, descriptions, amenities, photos) and OpenStreetMap (nearby places).
// Rebuild it with `node scripts/import-properties.mjs`; never edit properties.json by hand.
// This is the base: pages read the homes through getCatalog() in catalog.ts, which adds the dashboard's changes.
import data from "./properties.json";
import { label, priceStepsFor, regionSlug, type Home } from "./home-utils";

export * from "./home-utils";

export const homes = (data as Home[]).map((h) => ({ ...h, amenities: [...new Set(h.amenities.map(label))] }));
export const homeBySlug = (slug: string) => homes.find((h) => h.slug === slug);

// Regions, biggest first, for the search and the filters.
export const regions = Object.entries(homes.reduce<Record<string, number>>((acc, h) => ({ ...acc, [h.region]: (acc[h.region] ?? 0) + 1 }), {}))
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({ name, count }));

// Every town with homes, for the search suggestions.
export const towns = Object.values(homes.reduce<Record<string, { name: string; region: string; count: number }>>((acc, h) => {
  acc[h.town] = { name: h.town, region: h.region, count: (acc[h.town]?.count ?? 0) + 1 };
  return acc;
}, {})).sort((a, b) => b.count - a.count);

export const regionBySlug = (slug: string) => regions.find((r) => regionSlug(r.name) === slug);
export const reviewTotal = homes.reduce((n, h) => n + h.reviews, 0);

// The homes shown first: those with photos, then the most stayed in.
export const featured = [...homes].sort((a, b) => Number(!!b.photos[0]?.src) - Number(!!a.photos[0]?.src) || b.reviews - a.reviews);

export const priceSteps = priceStepsFor(homes);
