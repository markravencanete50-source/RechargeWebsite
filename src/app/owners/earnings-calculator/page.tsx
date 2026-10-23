import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { OwnerCalculator } from "@/components/OwnerCalculator";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { rateTable } from "@/content/estimate";
import { AVAILABLE_NIGHTS, MANAGEMENT_FEES, PLATFORM_FEE } from "@/content/estimate-sums";
import { showcase } from "@/content/showcase";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/owners/earnings-calculator";

export const metadata: Metadata = {
  title: "Short-let earnings calculator for Scotland",
  description: "Estimate what your property could earn as a short let in Scotland, with nightly rates taken from the homes Recharge runs today. Free, and nothing you enter is sent to us.",
  alternates: { canonical: path },
};

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

export default async function EarningsCalculatorPage() {
  const { homes } = await getCatalog();
  const table = rateTable();
  const areas = table.areas.filter((a) => [1, 2, 3].some((b) => table.rates[a][b])).slice(0, 10);
  const faqs = [
    { q: "Where do the nightly rates come from?", a: `From the ${homes.length} homes we run today. For each area and number of bedrooms, the quieter, typical and strong rates are the lower quarter, middle and upper quarter of our own prices. Where we run fewer than three such homes in an area, the rates come from the same size of home across Scotland, adjusted for prices in that area.` },
    { q: "Is this a guarantee of what I will earn?", a: "No. It is an estimate from our current prices. A free performance estimate from the team looks at your own property." },
    { q: "Why does booking direct change the result?", a: `Platform fees are charged only on stays booked through the platforms. Stays booked on our website have no platform fee, so a higher share of direct bookings leaves more for you.` },
    { q: "Is anything I enter sent to you?", a: "No. The calculator runs in your browser." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Owners", path: "/owners" }, { name: "Earnings calculator", path }]))} />
      <PageHero photo={showcase.ownerHero} eyebrow="For owners" title="Earnings calculator" lead={`What could your property earn as a short let? Choose the area and bedrooms. The nightly rates come from the ${homes.length} homes we run today.`} />
      <SubNav section="/owners" current={path} />

      <section className="section">
        <div className="wrap">
          <OwnerCalculator table={table} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">The sums</p>
            <h2 className="h2">How the numbers are worked out</h2>
            <p className="lead">The same sums as the owner estimate in the Recharge app. Nothing is hidden.</p>
          </Reveal>
          <RowList items={[
            { title: "Booking income", text: `The nightly rate, times the ${AVAILABLE_NIGHTS} nights of the year, times the share of nights booked.` },
            { title: "Platform fees", text: `${PLATFORM_FEE}% on the share of nights booked through Airbnb, Booking.com and the other platforms. None on nights booked direct.` },
            { title: "Management fee", text: `A percentage of the booking income. The calculator shows our two rates, ${MANAGEMENT_FEES.join("% and ")}%, and your estimate confirms yours.` },
            { title: "Left for you", text: "Booking income, less the platform fees and the management fee. Cleaning and running costs come off on your statement." },
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Our prices today</p><h2 className="h2">Typical nightly rates by area</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">The middle of our own prices, by number of bedrooms. They change as our homes and prices change.</p></Reveal>
          </div>
          <Reveal>
            <table className="rate-table">
              <thead><tr><th scope="col">Area</th><th scope="col">1 bedroom</th><th scope="col">2 bedrooms</th><th scope="col">3 bedrooms</th></tr></thead>
              <tbody>
                {areas.map((a) => (
                  <tr key={a}>
                    <th scope="row">{a}</th>
                    {[1, 2, 3].map((b) => <td key={b}>{table.rates[a][b] ? gbp(table.rates[a][b].medium) : "–"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <FaqSection items={faqs} title="About the calculator" eyebrow="Questions" tone="paper" more={false} />

      <section className="section">
        <div className="wrap">
          <div className="note-line">
            <p><strong>Want a figure for your own property?</strong> The team looks at your property and comes back with a free performance estimate.</p>
            <Link className="text-link" href="/owners#estimate">Get your free estimate <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
