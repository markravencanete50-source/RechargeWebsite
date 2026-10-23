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
import { partners } from "@/content/partners";
import { showcase } from "@/content/showcase";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/about/partners";

export const metadata: Metadata = {
  title: "Our trusted partners",
  description: "Recharge homes are listed on the major booking platforms, including Airbnb and Booking.com, and can be booked direct on our own website for less.",
  alternates: { canonical: path },
};

export default async function PartnersPage() {
  const { homes, direct } = await getCatalog();
  const faqs = [
    { q: "Is the home the same on every site?", a: "Yes. The home, the cleaning and the support are the same wherever you book. The team that runs it is always Recharge." },
    { q: "Where is it cheapest to book?", a: `On this website. Booking direct costs ${direct} less than the same home and dates on the booking sites.` },
    { q: "I booked on Airbnb or Booking.com. Who do I contact?", a: "You can message us through the platform you booked on, or call us at any hour. Either way you reach the same team." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "About", path: "/about" }, { name: "Trusted partners", path }]))} />
      <PageHero photo={showcase.business} eyebrow="About" title="Our trusted partners" lead={`Our ${homes.length} homes are listed on the major booking platforms, and on this website, where booking direct costs ${direct} less.`} />
      <SubNav section="/about" current={path} />

      <section className="section">
        <div className="wrap ab-partners">
          <Reveal className="ab-partners-copy">
            <p className="eyebrow">Where to find us</p>
            <h2 className="h2">Book wherever you like</h2>
            <p className="lead">Guests who already use a booking site can find our homes there. The home and the team are the same.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="ab-logos">
              <li>This website</li>
              {partners.map((p) => <li key={p.name}>{p.logo ? <Image src={p.logo} alt={p.name} width={140} height={48} /> : p.name}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Wherever you book</p>
            <h2 className="h2">What stays the same</h2>
            <p className="lead">The platform takes the booking. Everything after that is us.</p>
          </Reveal>
          <RowList items={[
            { title: "The same team", text: "Recharge runs every home, whichever site the booking came from." },
            { title: "The same clean", text: "Every clean finished with photo evidence before you arrive." },
            { title: "The same support", text: "A real person on the phone, day and night." },
            { title: "A better price here", text: `Booking direct on this website costs ${direct} less.` },
          ]} />
        </div>
      </section>

      <FaqSection items={faqs} title="Booking platforms" eyebrow="Questions" />

      <section className="section paper">
        <div className="wrap">
          <div className="note-line" style={{ marginTop: 0 }}>
            <p><strong>Want the best price?</strong> See how booking direct works and which offers are running today.</p>
            <Link className="text-link" href="/stay/book-direct">Book direct and save <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
