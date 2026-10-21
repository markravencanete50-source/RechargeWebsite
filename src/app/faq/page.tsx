import type { Metadata } from "next";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { appFaqs, generalFaqs, guestFaqs, ownerFaqs, propertiesFaqs, supportFaqs } from "@/content/faqs";
import { site } from "@/content/site";
import { breadcrumbs, faqPage, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Recharge for guests booking a stay, owners considering guaranteed rent or full management, the Recharge app and 24/7 support.",
  alternates: { canonical: "/faq" },
};

const groups = [
  { id: "about", t: "About Recharge", items: generalFaqs },
  { id: "guests", t: "For guests", items: guestFaqs },
  { id: "properties", t: "Finding a home", items: propertiesFaqs },
  { id: "owners", t: "For owners", items: ownerFaqs },
  { id: "app", t: "The Recharge app", items: appFaqs },
  { id: "support", t: "Support", items: supportFaqs },
];

export default function FaqPage() {
  const all = groups.flatMap((g) => g.items).filter((f, i, a) => a.findIndex((x) => x.q === f.q) === i);
  return (
    <>
      <JsonLd data={graph(faqPage(all), breadcrumbs([{ name: "FAQ", path: "/faq" }]))} />
      <PageHero eyebrow="FAQ" title="Questions and answers" lead={`Cannot find what you need? Call ${site.phone.display} or email ${site.email}.`}>
        <nav className="link-cloud faq-nav" aria-label="Topics">{groups.map((g) => <a key={g.id} href={`#${g.id}`}>{g.t}</a>)}</nav>
      </PageHero>
      {groups.map((g, i) => (
        <section key={g.id} id={g.id} className={`section ${i % 2 ? "paper" : ""}`} style={{ scrollMarginTop: 80 }}>
          <div className="wrap faq-grid">
            <Reveal className="section-head"><h2 className="h2">{g.t}</h2></Reveal>
            <Reveal><FaqList items={g.items} /></Reveal>
          </div>
        </section>
      ))}
    </>
  );
}
