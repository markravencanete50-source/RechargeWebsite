import type { MetadataRoute } from "next";
import { abs } from "@/lib/schema";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }], sitemap: abs("/sitemap.xml"), host: abs("/") };
}
