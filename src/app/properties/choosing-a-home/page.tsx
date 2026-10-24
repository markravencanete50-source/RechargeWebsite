import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { layoutFacts, sizes } from "@/content/property-guides";
import { packShot } from "@/content/showcase";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/properties/choosing-a-home";

export const metadata: Metadata = {
  title: "Choosing the right home",
  description: "How to choose a Recharge home in Scotland: our homes by size, how many each sleeps, beds and bathrooms, and what each home's page tells you before you book.",
  alternates: { canonical: path },
};

export default async function ChoosingPage() {
  const { homes } = await getCatalog();
  const rows = sizes(homes);
  const f = layoutFacts(homes);
  const usual = [...rows].sort((a, b) => b.count - a.count)[0];
  const photo = packShot("R03");
  const faqs = [
    { q: "What does Sleeps mean on a home?", a: "It is the most people the home can take. Count everyone in your group, then choose a home that sleeps at least that many." },
    { q: "Where do I see the beds in each room?", a: "On the home's own page, under Where you will sleep. Each bedroom is listed with its beds." },
    { q: "What is the biggest home you have?", a: `Our largest homes sleep ${f.most}. Set the number of guests in the search to see every home that fits your group.` },
    { q: "Can I see a home before I book?", a: "Each home's page has photos of the home and a map of what is nearby. If you want to know something the page does not say, call us." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Properties", path: "/properties" }, { name: "Choosing a home", path }]))} />
      <PageHero photo={packShot("R05")} eyebrow="Properties" title="Choosing the right home" lead={`We run ${f.total} homes across Scotland. This is how to pick the size that fits, and what each home's page tells you before you book.`} />
      <SubNav section="/properties" current={path} />

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Sizes</p><h2 className="h2">Our homes by size</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">{usual.count} of our {f.total} homes have {usual.label}, our most common size. Choose a size to see every home of that size.</p></Reveal>
          </div>
          <Reveal>
            <table className="rate-table">
              <thead><tr><th scope="col">Size</th><th scope="col">Homes</th><th scope="col">Sleeps</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row"><Link className="text-link" href={r.href}>{r.label}</Link></th>
                    <td>{r.count}</td>
                    <td>{r.sleeps[0] === r.sleeps[1] ? r.sleeps[0] : `${r.sleeps[0]} to ${r.sleeps[1]}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Beds and bathrooms</p>
            <h2 className="h2">Read the beds, not only the bedrooms</h2>
            <p className="lead" style={{ marginTop: 18 }}>Two homes with the same number of bedrooms can sleep a different number of people.</p>
          </Reveal>
          <RowList items={[
            { title: "Sleeps is the most guests allowed", text: "It is the most people the home can take. Count everyone in your group before you choose." },
            { title: "Many homes sleep more than their bedrooms suggest", text: `${f.moreThanTwoPerRoom} of our ${f.total} homes sleep more than two people for each bedroom, and ${f.sofaBed} listings mention a sofa bed. Check where each person will sleep.` },
            { title: "Beds are listed room by room", text: `On ${f.roomByRoom} homes' pages, Where you will sleep shows the beds in every bedroom.` },
            { title: "Check the bathrooms for a group", text: `${f.oneBath} homes have one bathroom and ${f.twoBaths} have two. For a larger group, check the bathroom count before you book.` },
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap spec">
          <Reveal className="spec-media">
            <Image src={photo.src} alt={photo.alt ?? ""} fill sizes="(max-width: 900px) 100vw, 45vw" />
          </Reveal>
          <div className="spec-body">
            <Reveal>
              <p className="eyebrow">On every home&apos;s page</p>
              <h2 className="h2">What each home&apos;s page tells you</h2>
            </Reveal>
            <RowList items={[
              { title: "Photos", text: "Choose any photo to see them all at full size." },
              { title: "What this home offers", text: "Everything the home lists. Choose Show all for the full list, grouped by room." },
              { title: "Where you will be", text: "A map of places nearby, with travel times where the host gives them." },
              { title: "Good to know", text: "Check-in and check-out times, and the home's own house rules." },
              { title: "A typical price", text: <>The usual price for a night. <Link className="text-link" href="/properties/prices">How our prices work</Link></> },
            ]} />
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Before you book</p>
            <h2 className="h2">Worth asking us</h2>
            <p className="lead" style={{ marginTop: 18 }}>A few things the listings do not always say. Call us and a real person will answer, day or night.</p>
          </Reveal>
          <RowList items={[
            { title: "Stairs and access", text: "Few listings say which floor a home is on or whether there is a lift. If stairs matter to you, ask before you book." },
            { title: "A van or a second car", text: <>Parking differs from home to home. Tell us what you are bringing. <Link className="text-link" href="/properties/parking-and-transport">Parking and getting there</Link></> },
            { title: "Something not on the list", text: "If you need something the home's page does not mention, ask us before you book rather than after you arrive." },
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="note-line">
            <p><strong>Know what you need?</strong> Search every home by area, dates and number of guests.</p>
            <Link className="text-link" href="/properties">Search all {f.total} homes <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <FaqSection items={faqs} title="Choosing a home" eyebrow="Questions" tone="paper" />
    </>
  );
}
