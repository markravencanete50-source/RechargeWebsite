import type { Metadata } from "next";
import { FaqList } from "@/components/FaqList";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { guestFaqs, ownerFaqs } from "@/content/faqs";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers for guests booking a Recharge stay and for owners thinking about guaranteed rent or full management.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Questions and answers" lead={`Can't find what you need? Call ${site.phone.display} or email ${site.email}.`} />
      {[
        { id: "guests", t: "For guests", items: guestFaqs, bg: "" },
        { id: "owners", t: "For owners", items: ownerFaqs, bg: "paper" },
      ].map((g) => (
        <section key={g.id} id={g.id} className={`section ${g.bg}`}>
          <div className="wrap faq-grid">
            <Reveal className="section-head"><h2 className="h2">{g.t}</h2></Reveal>
            <Reveal><FaqList items={g.items} /></Reveal>
          </div>
        </section>
      ))}
    </>
  );
}
