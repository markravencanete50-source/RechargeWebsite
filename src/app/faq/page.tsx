import { ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqExplorer } from "@/components/FaqExplorer";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { appFaqs, generalFaqs, guestFaqs, ownerFaqs, propertiesFaqs, supportExtraFaqs, supportFaqs } from "@/content/faqs";
import { getCatalog } from "@/content/catalog";
import { showcase } from "@/content/showcase";
import { site, withDirect } from "@/content/site";
import { breadcrumbs, faqPage, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Recharge for guests booking a stay, owners considering guaranteed rent or full management, the Recharge app and 24/7 support.",
  alternates: { canonical: "/faq" },
};

const groups = [
  { id: "about", t: "About Recharge", lead: "Who we are and how we work.", items: generalFaqs },
  { id: "guests", t: "Booking and staying", lead: "Before you book and during your stay.", items: guestFaqs },
  { id: "properties", t: "Finding a home", lead: "Searching, prices and areas.", items: propertiesFaqs },
  { id: "owners", t: "For owners", lead: "Guaranteed rent, full management and getting started.", items: ownerFaqs },
  { id: "app", t: "The Recharge app", lead: "What the app does and who sees what.", items: appFaqs },
  { id: "support", t: "Support", lead: "Reaching us, day or night.", items: [...supportFaqs, ...supportExtraFaqs] },
];

export default async function FaqPage() {
  const { homes, direct } = await getCatalog();
  const filled = groups.map((g) => ({ ...g, items: withDirect(g.items, direct) }));
  const all = filled.flatMap((g) => g.items).filter((f, i, a) => a.findIndex((x) => x.q === f.q) === i);
  return (
    <>
      <JsonLd data={graph(faqPage(all), breadcrumbs([{ name: "FAQ", path: "/faq" }]))} />
      <PageHero photo={showcase.business} eyebrow="FAQ" title="Questions and answers" lead={`${all.length} straight answers for guests, owners and neighbours. Search below, or call ${site.phone.display} at any hour.`}>
        <nav className="link-cloud faq-nav" aria-label="Topics">{groups.map((g) => <a key={g.id} href={`#${g.id}`}>{g.t}</a>)}</nav>
      </PageHero>

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(all.length), "questions answered"], [String(groups.length), "topics"], ["24/7", "a person for anything else"], [String(homes.length), "homes our answers cover"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <FaqExplorer groups={filled} phone={site.phone} />
        </div>
      </section>

      <section className="call-band dark on-dark">
        <div className="wrap call-band-inner">
          <Reveal><p className="call-band-big">24/7</p></Reveal>
          <Reveal delay={0.08}>
            <h2 className="h2">Did not find your answer?</h2>
            <p className="lead">A real person is on hand at any hour. Or send a message and we will reply in writing.</p>
          </Reveal>
          <Reveal delay={0.16} className="call-band-actions">
            <a className="btn btn-mint" href={site.phone.href}><Phone size={18} /> {site.phone.display}</a>
            <Link className="btn btn-line-light" href="/support#contact">Send a message <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
