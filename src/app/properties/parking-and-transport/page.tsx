import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FactSheet } from "@/components/FactSheet";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { parkingFacts, transportFacts } from "@/content/property-guides";
import { packShot } from "@/content/showcase";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/properties/parking-and-transport";

export const metadata: Metadata = {
  title: "Parking and getting there",
  description: "Which Recharge homes in Scotland have free, private or street parking, and which are close to a train station, a bus route or an airport, counted from every listing.",
  alternates: { canonical: path },
};

export default async function ParkingPage() {
  const { homes } = await getCatalog();
  const total = homes.length;
  const parking = parkingFacts(homes);
  const free = parking.find((p) => p.title === "Free parking")?.count ?? 0;
  const faqs = [
    { q: "Which homes have free parking?", a: `${free} of our homes list free parking. See them all on the free parking page, or check What this home offers on any home's page.` },
    { q: "Can I park a van?", a: "It depends on the home. Tell us what you are bringing before you book." },
    { q: "How do I get into the home when I arrive?", a: "We send the address and how to get in before you arrive." },
    { q: "Are travel times on a home's page exact?", a: "No. They are approximate and given by the host. Choose a place on the map to see where it is." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Properties", path: "/properties" }, { name: "Parking and getting there", path }]))} />
      <PageHero photo={packShot("L08", "50% 60%")} eyebrow="Properties" title="Parking and getting there" lead={`Which of our ${total} homes have parking, and which are close to a station or an airport. Counted from every listing, so the numbers are real.`} />
      <SubNav section="/properties" current={path} />

      <section className="section">
        <div className="wrap spec">
          <Reveal>
            <p className="eyebrow">Parking</p>
            <h2 className="h2">Parking at our homes</h2>
            <p className="lead" style={{ marginTop: 18 }}>A home can list more than one kind. Each home&apos;s page shows its parking under What this home offers.</p>
            <Link className="text-link" href="/properties/collection/free-parking" style={{ marginTop: 18, display: "inline-flex" }}>Homes with free parking <ArrowRight size={16} /></Link>
          </Reveal>
          <FactSheet items={parking} total={total} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap spec">
          <Reveal>
            <p className="eyebrow">Without a car</p>
            <h2 className="h2">Close to a station or an airport</h2>
            <p className="lead" style={{ marginTop: 18 }}>Counted from what each home&apos;s description says about where it is. Open a home to read the details and see a map of what is nearby.</p>
            <Link className="text-link" href="/properties/collection/city-centre" style={{ marginTop: 18, display: "inline-flex" }}>Homes in the city centre <ArrowRight size={16} /></Link>
          </Reveal>
          <FactSheet items={transportFacts(homes)} total={total} />
        </div>
      </section>

      <section className="section">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Before you set off</p>
            <h2 className="h2">Arriving by car</h2>
          </Reveal>
          <RowList items={[
            { title: "Check the kind of parking", text: "Free, street, private or paid. It is on the home's page under What this home offers." },
            { title: "Permits in the city centres", text: "In parts of Edinburgh and Glasgow, parking on the street needs a permit or a paid ticket. Read the signs when you arrive." },
            { title: "A van or two cars", text: "Space differs from home to home. Tell us what you are bringing before you book." },
            { title: "Your arrival details", text: "We send the address and how to get in before you arrive." },
          ]} />
        </div>
      </section>

      <FaqSection items={faqs} title="Getting there" eyebrow="Questions" tone="paper" />
    </>
  );
}
