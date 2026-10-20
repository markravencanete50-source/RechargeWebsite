import { ArrowRight, BadgePercent, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { Steps } from "@/components/Steps";
import { guestFaqs } from "@/content/faqs";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Stays",
  description: `Serviced apartments in Scotland for city breaks, work trips and families. Book direct and save ${site.directDiscount}.`,
  alternates: { canonical: "/stay" },
};

export default function StayPage() {
  return (
    <>
      <PageHero eyebrow="Stays" title="A clean, well run home for your stay" lead="City breaks, work trips, contractors and families. Book direct with Recharge for the best rate.">
        <SearchBar />
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Why book direct</p>
            <h2 className="h2">Better rate. Real support.</h2>
          </Reveal>
          <div className="cards-3">
            {[
              { icon: <BadgePercent size={22} />, t: `Save ${site.directDiscount}`, d: "Booking direct with Recharge costs less than booking the same home elsewhere." },
              { icon: <Sparkles size={22} />, t: "Cleaned and checked", d: "Every home is cleaned to a checklist, with photos, before you arrive." },
              { icon: <Clock size={22} />, t: "Help at any hour", d: "Message or call us 24/7. Urgent problems go straight to our maintenance team." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 0.08} className="card"><span className="ic">{c.icon}</span><strong className="h3">{c.t}</strong><p>{c.d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Your stay</p>
            <h2 className="h2">How it works</h2>
          </Reveal>
          <Steps items={[
            ["Book", "Choose your home and dates and book direct."],
            ["Get your details", "We send the address, access instructions and wifi before you arrive."],
            ["Arrive", "Let yourself in. The home is cleaned and ready."],
            ["Check out", "Leave the keys as instructed. We take it from there."],
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap faq-grid">
          <Reveal className="section-head">
            <p className="eyebrow">Guest questions</p>
            <h2 className="h2">Before you book</h2>
            <Link className="text-link" href="/faq">All questions <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal><FaqList items={guestFaqs} /></Reveal>
        </div>
      </section>
    </>
  );
}
