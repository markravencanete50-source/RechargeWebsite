import type { Metadata } from "next";
import { Suspense } from "react";
import { AreaIndex } from "@/components/AreaIndex";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { PropertyResults } from "@/components/PropertyResults";
import { propertiesFaqs } from "@/content/faqs";
import { cardOf, getCatalog } from "@/content/catalog";
import { heading } from "@/content/home-utils";
import { showcase } from "@/content/showcase";
import { abs, breadcrumbs, graph } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const { homes, regions, direct } = await getCatalog();
  return {
  title: "Properties",
  description: `${homes.length} serviced apartments and homes to book direct across Scotland, in ${regions.slice(0, 5).map((r) => r.name).join(", ")} and more. Save ${direct} booking direct.`,
  alternates: { canonical: "/properties" },
  };
}

export default async function PropertiesPage() {
  const { homes, regions, towns, priceSteps } = await getCatalog();
  return (
    <>
      <JsonLd data={graph(
        { "@type": "ItemList", name: "Recharge homes", numberOfItems: homes.length, itemListElement: homes.map((h, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/properties/${h.slug}`), name: heading(h) })) },
        breadcrumbs([{ name: "Properties", path: "/properties" }]),
      )} />
      <PageHero photo={showcase.stayHero} eyebrow="Properties" title="Find a Recharge home" lead="Search by area, dates and guests. Every home is cleaned, checked and supported 24/7." />
      <SubNav section="/properties" current="/properties" />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <Suspense fallback={<div style={{ minHeight: 400 }} />}>
            <PropertyResults homes={homes.map(cardOf)} options={{ regions, towns, priceSteps }} />
          </Suspense>
        </div>
      </section>
      <section className="section paper">
        <div className="wrap">
          <h2 className="h3" style={{ marginBottom: 20 }}>Browse by area</h2>
          <AreaIndex />
        </div>
      </section>
      <FaqSection items={propertiesFaqs} title="Finding a home" eyebrow="Questions" />
    </>
  );
}
