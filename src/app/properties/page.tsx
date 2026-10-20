import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { PropertyResults } from "@/components/PropertyResults";

export const metadata: Metadata = {
  title: "Properties",
  description: "Serviced apartments and homes to book direct in Glasgow, Edinburgh, Paisley, Livingston and Tranent.",
  alternates: { canonical: "/properties" },
};

export default function PropertiesPage() {
  return (
    <>
      <PageHero eyebrow="Properties" title="Find a Recharge home" lead="Search by area, dates and guests. Every home is cleaned, checked and supported 24/7." />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <Suspense fallback={<div style={{ minHeight: 400 }} />}>
            <PropertyResults />
          </Suspense>
        </div>
      </section>
    </>
  );
}
