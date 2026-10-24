import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { money } from "@/content/home-utils";
import { longStayDiscounts, sizes } from "@/content/property-guides";
import { packShot } from "@/content/showcase";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/properties/prices";

export async function generateMetadata(): Promise<Metadata> {
  const { direct } = await getCatalog();
  return {
    title: "How our prices work",
    description: `What a night costs in a Recharge home in Scotland, by number of bedrooms, what the price on each home means, and how to pay less. Book direct and save ${direct}.`,
    alternates: { canonical: path },
  };
}

export default async function PricesPage() {
  const { homes, direct } = await getCatalog();
  const rows = sizes(homes);
  const longDiscount = longStayDiscounts(homes);
  const cheapest = Math.min(...rows.map((r) => r.from));
  const faqs = [
    { q: "Why is my total different from the price on the home?", a: "The price on each home is a typical night. Your total depends on your dates and how many nights you stay. The team confirms the full price before anything is charged." },
    { q: "How do I get the best price?", a: `Book on this website rather than a booking site, which saves ${direct}. For a stay of several weeks, call us about a long-stay rate.` },
    { q: "Do prices change?", a: "Yes. Prices change from night to night. The team confirms the price for your dates before anything is charged." },
    { q: "Is there a charge to send a booking request?", a: "No. Nothing is charged until the team confirms your request." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Properties", path: "/properties" }, { name: "How our prices work", path }]))} />
      <PageHero photo={packShot("R10")} eyebrow="Properties" title="How our prices work" lead={`Homes from around ${money(cheapest)} a night. What the price on each home means, what a night typically costs, and how to pay less.`} />
      <SubNav section="/properties" current={path} />

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Our prices today</p><h2 className="h2">What a night typically costs</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">The lowest, middle and highest typical price among our homes of each size. They change as our prices change.</p></Reveal>
          </div>
          <Reveal>
            <table className="rate-table">
              <thead><tr><th scope="col">Size</th><th scope="col">From</th><th scope="col">Typical</th><th scope="col">Up to</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row"><Link className="text-link" href={r.href}>{r.label}</Link></th>
                    <td>{money(r.from)}</td>
                    <td>{money(r.typical)}</td>
                    <td>{money(r.to)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <p className="fine" style={{ marginTop: 14 }}>Prices are for the whole home for one night, not for each guest.</p>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">The price on each home</p>
            <h2 className="h2">What the price shows</h2>
            <p className="lead" style={{ marginTop: 18 }}>Each home shows one price, so you can compare homes before you choose dates.</p>
          </Reveal>
          <RowList items={[
            { title: "A typical night", text: "The price on each home is its usual nightly rate, worked out from its calendar for the next 60 days." },
            { title: "Your dates can cost more or less", text: "Prices change from night to night, so the nights you choose may cost more or less than the typical price." },
            { title: "The full price before you pay", text: "Send a request for your dates. The team confirms the full price, and nothing is charged until then." },
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Paying less</p>
            <h2 className="h2">Two ways to pay less</h2>
          </Reveal>
          <RowList items={[
            { title: `Book direct and save ${direct}`, text: <>The same home and dates cost {direct} less on this website than on the booking sites. <Link className="text-link" href="/stay/book-direct">Book direct and save</Link></> },
            { title: "Stay longer", text: `${longDiscount} of our ${homes.length} homes offer a discount for a longer booking. Call us with your dates.` },
          ]} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="note-line">
            <p><strong>Ready to look?</strong> Set a price limit in the search to see the homes in your budget.</p>
            <Link className="text-link" href="/properties">Search all {homes.length} homes <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <FaqSection items={faqs} title="About our prices" eyebrow="Questions" />
    </>
  );
}
