// The homes as the site shows them: the Hostaway build (properties.json) with the dashboard's changes on top, plus listings made
// in the dashboard, the direct-booking discount and the live offers. Read once and cached; it refreshes within a minute, and at
// once when an admin saves (the dashboard calls updateTag("catalog")). If the website's database cannot be reached, the site
// carries on with the Hostaway build alone.
import { cacheLife, cacheTag } from "next/cache";
import { hostawayConnected, hostawayPhotoUrls } from "@/lib/hostaway";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase-config";
import { homes as base } from "./properties";
import { label, priceStepsFor, regionSlug, type Home } from "./home-utils";

export type Override = { hostaway_id: number; published: boolean; featured_rank: number | null; title: string | null; description: string | null; amenities: string[] | null };
export type WebsiteListing = { id: string; slug: string; published: boolean; featured_rank: number | null; data: Partial<Home> };
export type Discount = { id: string; kind: "offer" | "new_customer"; label: string; percent: number; starts_on: string | null; ends_on: string | null; region: string | null; active: boolean };
export type Region = { name: string; count: number };
export type Town = { name: string; region: string; count: number };
export type Catalog = {
  homes: Home[]; featured: Home[]; regions: Region[]; towns: Town[]; reviewTotal: number; priceSteps: number[];
  directDiscount: number; discounts: Discount[];
};

async function rows<T>(path: string): Promise<T[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, signal: AbortSignal.timeout(4000) });
    return res.ok ? ((await res.json()) as T[]) : null;
  } catch {
    return null;
  }
}

// A listing made in the dashboard, as a home. It has no Hostaway calendar, so the booking panel offers requests only.
function fromWebsite(l: WebsiteListing): Home | null {
  const d = l.data;
  if (!d.title || !d.town || !d.region) return null;
  return {
    slug: l.slug, hostawayId: 0, source: "website", region: d.region, town: d.town, district: d.district ?? "", reviews: 0,
    title: d.title, customTitle: d.customTitle ?? d.title, description: d.description, houseRules: d.houseRules,
    guests: d.guests, bedrooms: d.bedrooms ?? 1, beds: d.beds, bathrooms: d.bathrooms, price: d.price, currency: d.currency ?? "GBP",
    checkIn: d.checkIn, checkOut: d.checkOut, amenities: [...new Set((d.amenities ?? []).map(label))], photos: d.photos ?? [], licence: d.licence,
  };
}

// Photos for the homes whose pictures changed in Hostaway since the import. The old addresses stop working when the team replaces
// a listing's photos, so for those homes the site uses Hostaway's current list, in its order, without the branded tiles. Homes
// whose photos are all still there keep the imported list as it is. Checked every few hours; if Hostaway cannot be reached the
// imported photos stay.
async function changedPhotos(): Promise<Record<number, string[]>> {
  "use cache";
  cacheTag("catalog-photos");
  cacheLife({ stale: 3600, revalidate: 6 * 3600, expire: 7 * 24 * 3600 });
  if (!hostawayConnected()) return {};
  try {
    const live = await hostawayPhotoUrls();
    const known = new Set(base.flatMap((h) => h.photos.map((p) => p.src).filter(Boolean)));
    const { isTile } = await import("@/lib/photo-tiles");
    const out: Record<number, string[]> = {};
    for (const h of base) {
      const urls = live.get(h.hostawayId);
      if (!urls?.length) continue;
      const now = new Set(urls);
      if (h.photos.every((p) => !p.src || now.has(p.src))) continue;
      const unknown = urls.filter((u) => !known.has(u));
      const tiles = new Set<string>();
      for (let i = 0; i < unknown.length; i += 8) {
        const checked = await Promise.all(unknown.slice(i, i + 8).map(async (u) => [u, await isTile(u).catch(() => true)] as const));
        for (const [u, tile] of checked) if (tile) tiles.add(u);
      }
      const keep = urls.filter((u) => !tiles.has(u));
      if (keep.length) out[h.hostawayId] = keep;
    }
    return out;
  } catch {
    return {};
  }
}

export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag("catalog");
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const [overrides, listings, settings, discounts, photos] = await Promise.all([
    rows<Override>("listing_overrides?select=hostaway_id,published,featured_rank,title,description,amenities"),
    rows<WebsiteListing>("website_listings?select=id,slug,published,featured_rank,data&published=eq.true"),
    rows<{ direct_discount_pct: number }>("settings?select=direct_discount_pct"),
    rows<Discount>("discounts?select=id,kind,label,percent,starts_on,ends_on,region,active&active=eq.true"),
    changedPhotos(),
  ]);

  const byId = new Map((overrides ?? []).map((o) => [o.hostaway_id, o]));
  const rank = new Map<string, number>();
  const homes: Home[] = [];
  for (const imported of base) {
    const fresh = photos[imported.hostawayId];
    const alt = imported.photos[0]?.alt ?? `${imported.title}, ${imported.town}`;
    const h = fresh ? { ...imported, photos: fresh.map((src) => ({ src, alt })) } : imported;
    const o = byId.get(h.hostawayId);
    if (o && !o.published) continue;
    if (o?.featured_rank) rank.set(h.slug, o.featured_rank);
    homes.push(o ? {
      ...h, source: "hostaway",
      ...(o.title ? { customTitle: o.title } : {}),
      ...(o.description ? { description: o.description } : {}),
      ...(o.amenities ? { amenities: [...new Set(o.amenities.map(label))] } : {}),
    } : { ...h, source: "hostaway" });
  }
  for (const l of listings ?? []) {
    const home = fromWebsite(l);
    if (!home || homes.some((h) => h.slug === home.slug)) continue;
    if (l.featured_rank) rank.set(home.slug, l.featured_rank);
    homes.push(home);
  }

  const regions = Object.entries(homes.reduce<Record<string, number>>((acc, h) => ({ ...acc, [h.region]: (acc[h.region] ?? 0) + 1 }), {}))
    .sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  const towns = Object.values(homes.reduce<Record<string, Town>>((acc, h) => {
    acc[h.town] = { name: h.town, region: h.region, count: (acc[h.town]?.count ?? 0) + 1 };
    return acc;
  }, {})).sort((a, b) => b.count - a.count);
  // Featured first, in the order the team set; then those with photos, then the most stayed in.
  const featured = [...homes].sort((a, b) =>
    (rank.get(a.slug) ?? 1000) - (rank.get(b.slug) ?? 1000) || Number(!!b.photos[0]?.src) - Number(!!a.photos[0]?.src) || b.reviews - a.reviews);

  return {
    homes, featured, regions, towns,
    reviewTotal: homes.reduce((n, h) => n + h.reviews, 0),
    priceSteps: priceStepsFor(homes),
    directDiscount: Number(settings?.[0]?.direct_discount_pct ?? 10),
    discounts: (discounts ?? []).map((d) => ({ ...d, percent: Number(d.percent) })),
  };
}

export const homeIn = (c: Catalog, slug: string) => c.homes.find((h) => h.slug === slug);
export const regionIn = (c: Catalog, slug: string) => c.regions.find((r) => regionSlug(r.name) === slug);
// What a card needs, with only the first two photos, for the parts of the site that run in the browser.
export const cardOf = (h: Home): Home => ({ ...h, description: undefined, houseRules: undefined, nearby: undefined, photos: h.photos.slice(0, 2), photoCount: h.photos.length });
