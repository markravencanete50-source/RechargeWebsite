import type { MetadataRoute } from "next";
import { regionSlug } from "@/content/home-utils";
import { getCatalog } from "@/content/catalog";
import { abs } from "@/lib/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { homes, regions } = await getCatalog();
  const pages: [string, number][] = [["/", 1], ["/properties", 0.9], ["/owners", 0.9], ["/guaranteed-rent", 0.9], ["/stay", 0.8], ["/stay/book-direct", 0.7], ["/stay/trips", 0.7], ["/stay/check-in", 0.6], ["/stay/amenities", 0.6], ["/owners/full-management", 0.8], ["/owners/earnings-calculator", 0.8], ["/owners/example-statement", 0.6], ["/owners/furnishing-calculator", 0.6], ["/support/report-a-problem", 0.5], ["/app", 0.8], ["/support", 0.6], ["/faq", 0.6], ["/about", 0.7]];
  return [
    ...pages.map(([p, priority]) => ({ url: abs(p), changeFrequency: "weekly" as const, priority })),
    ...regions.map((r) => ({ url: abs(`/properties/area/${regionSlug(r.name)}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...homes.map((h) => ({ url: abs(`/properties/${h.slug}`), changeFrequency: "weekly" as const, priority: 0.6, images: h.photos.slice(0, 3).map((p) => p.src).filter((s): s is string => !!s) })),
  ];
}
