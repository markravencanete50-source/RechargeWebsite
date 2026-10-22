import type { MetadataRoute } from "next";
import { regionSlug } from "@/content/home-utils";
import { getCatalog } from "@/content/catalog";
import { abs } from "@/lib/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { homes, regions } = await getCatalog();
  const pages: [string, number][] = [["/", 1], ["/properties", 0.9], ["/owners", 0.9], ["/stay", 0.8], ["/app", 0.8], ["/support", 0.6], ["/faq", 0.6]];
  return [
    ...pages.map(([p, priority]) => ({ url: abs(p), changeFrequency: "weekly" as const, priority })),
    ...regions.map((r) => ({ url: abs(`/properties/area/${regionSlug(r.name)}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...homes.map((h) => ({ url: abs(`/properties/${h.slug}`), changeFrequency: "weekly" as const, priority: 0.6, images: h.photos.slice(0, 3).map((p) => p.src).filter((s): s is string => !!s) })),
  ];
}
