import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FactSheet } from "@/components/FactSheet";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { packShot } from "@/content/showcase";
import { extraFacts, homeFacts, safetyFacts } from "@/content/stay";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/stay/amenities";

export const metadata: Metadata = {
  title: "What our homes have",
  description: "Kitchens, wifi, fresh linen, washing machines, parking and safety equipment, counted from the listings of every Recharge home in Scotland.",
  alternates: { canonical: path },
};

export default async function AmenitiesPage() {
  const { homes } = await getCatalog();
  const total = homes.length;
  const faqs = [
    { q: "What is included in every stay?", a: "A professionally cleaned home, fresh bed linen and towels, a kitchen with cooking basics and 24/7 support. Each home lists exactly what it has." },
    { q: "Where do I see everything a home has?", a: "On the home's own page, under What this home offers. Choose Show all to see the full list, grouped by room." },
    { q: "Is there parking?", a: "Many homes have free parking. Each property page shows its parking under What this home offers." },
    { q: "Is there wifi?", a: "Most homes list wifi. The details come with your check-in information." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Stays", path: "/stay" }, { name: "What our homes have", path }]))} />
      <PageHero photo={packShot("R06")} eyebrow="Stays" title="What our homes have" lead={`Counted from the listings of all ${total} homes we run, so the numbers are real. Each home's page lists everything it has.`} />
      <SubNav section="/stay" current={path} />

      <section className="section">
        <div className="wrap spec">
          <Reveal className="spec-media">
            <Image src={packShot("R09").src} alt={packShot("R09").alt ?? ""} fill sizes="(max-width: 900px) 100vw, 45vw" />
          </Reveal>
          <div className="spec-body">
            <Reveal>
              <p className="eyebrow">In the home</p>
              <h2 className="h2">The everyday things</h2>
            </Reveal>
            <FactSheet items={homeFacts(homes)} total={total} />
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap spec">
          <Reveal>
            <p className="eyebrow">Safety</p>
            <h2 className="h2">Safety equipment</h2>
            <p className="lead" style={{ marginTop: 18 }}>The safety equipment each home lists. Short-term lets in Scotland need a licence from the council, and the licence sets its own safety checks.</p>
          </Reveal>
          <FactSheet items={safetyFacts(homes)} total={total} />
        </div>
      </section>

      <section className="section">
        <div className="wrap spec">
          <Reveal>
            <p className="eyebrow">Looking for something in particular?</p>
            <h2 className="h2">Fewer homes have these</h2>
            <p className="lead" style={{ marginTop: 18 }}>Search our homes and open any home to see its full list.</p>
            <Link className="text-link" href="/properties" style={{ marginTop: 18, display: "inline-flex" }}>Search all {total} homes <ArrowRight size={16} /></Link>
          </Reveal>
          <FactSheet items={extraFacts(homes)} total={total} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Every stay</p>
            <h2 className="h2">Ready when you arrive</h2>
            <div className="split-photo"><Image src={packShot("R04").src} alt={packShot("R04").alt ?? ""} fill sizes="(max-width: 860px) 100vw, 40vw" /></div>
          </Reveal>
          <RowList items={[
            { title: "A professional clean", text: "Every clean is finished with photo evidence in the Recharge app." },
            { title: "Fresh linen and towels", text: "Beds made up before you arrive." },
            { title: "Cooking basics", text: "In every home with a kitchen." },
            { title: "Support at any hour", text: "A real person on the phone, day and night." },
          ]} />
        </div>
      </section>

      <FaqSection items={faqs} title="About the homes" eyebrow="Questions" />
    </>
  );
}
