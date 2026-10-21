import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { PropertyResults } from "@/components/PropertyResults";
import { propertiesFaqs } from "@/content/faqs";
import { heading, homes, regions, regionSlug } from "@/content/properties";
import { site } from "@/content/site";
import { abs, breadcrumbs, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Properties",
  description: `${homes.length} serviced apartments and homes to book direct across Scotland, in ${regions.slice(0, 5).map((r) => r.name).join(", ")} and more. Save ${site.directDiscount} booking direct.`,
  alternates: { canonical: "/properties" },
};

export default function PropertiesPage() {
  return (
    <>
      <JsonLd data={graph(
        { "@type": "ItemList", name: "Recharge homes", numberOfItems: homes.length, itemListElement: homes.map((h, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/properties/${h.slug}`), name: heading(h) })) },
        breadcrumbs([{ name: "Properties", path: "/properties" }]),
      )} />
      <PageHero eyebrow="Properties" title="Find a Recharge home" lead="Search by area, dates and guests. Every home is cleaned, checked and supported 24/7." />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <Suspense fallback={<div style={{ minHeight: 400 }} />}>
            <PropertyResults />
          </Suspense>
        </div>
      </section>
      <section className="section paper">
        <div className="wrap">
          <h2 className="h3" style={{ marginBottom: 16 }}>Browse by area</h2>
          <div className="link-cloud">
            {regions.map((r) => <Link key={r.name} href={`/properties/area/${regionSlug(r.name)}`}>{r.name} <span>{r.count}</span></Link>)}
          </div>
        </div>
      </section>
      <FaqSection items={propertiesFaqs} title="Finding a home" eyebrow="Questions" />
    </>
  );
}
