import { ArrowRight, BadgePercent, Briefcase, CalendarRange, Clock, HardHat, KeyRound, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { Steps } from "@/components/Steps";
import { guestFaqs } from "@/content/faqs";
import { homes, regions, regionSlug, reviewTotal } from "@/content/properties";
import { site } from "@/content/site";
import { breadcrumbs, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Stays",
  description: `Serviced apartments in Scotland for city breaks, work trips and families. Book direct and save ${site.directDiscount}.`,
  alternates: { canonical: "/stay" },
};

export default function StayPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Stays", path: "/stay" }]))} />
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
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Who stays with us</p>
            <h2 className="h2">Homes for every kind of trip</h2>
          </Reveal>
          <div className="promise">
            {[
              { icon: <HardHat size={22} />, t: "Contractors and work crews", d: "Whole homes with parking and kitchens, close to sites and transport links. Long-stay discounts on request." },
              { icon: <Briefcase size={22} />, t: "Business travel", d: "Quiet, central homes with space to work and support at any hour." },
              { icon: <Users size={22} />, t: "Families and groups", d: "Homes that sleep up to 10, with full kitchens, living space and room for everyone." },
              { icon: <CalendarRange size={22} />, t: "Longer stays", d: "Relocations, renovations and insurance stays, in a home rather than a hotel room." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 0.06}><div><span className="ic">{c.icon}</span><strong>{c.t}</strong><p>{c.d}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Every stay</p>
            <h2 className="h2">What you can count on</h2>
          </Reveal>
          <div className="proof">
            {[
              [String(homes.length), "homes to choose from"],
              [String(regions.length), "areas of Scotland"],
              [reviewTotal.toLocaleString("en-GB"), "reviews from past guests"],
              ["24/7", "help from a real person"],
            ].map(([n, t], i) => <Reveal key={t} delay={i * 0.06}><div><strong>{n}</strong><span>{t}</span></div></Reveal>)}
          </div>
          <div className="diff-grid">
            {[
              [<ShieldCheck key="a" size={20} />, "Checked before you arrive", "Each clean is finished with photo evidence in the Recharge app."],
              [<KeyRound key="b" size={20} />, "Simple arrival", "Your access details arrive before your stay."],
              [<Clock key="c" size={20} />, "Fast replies", "Guest messages are tracked with live response timers."],
              [<Sparkles key="d" size={20} />, "Problems fixed", "A fault you report becomes a repair job, followed to the finish."],
            ].map(([icon, t, d], i) => (
              <Reveal key={String(t)} delay={i * 0.08} className="diff">
                <span className="num">{icon}</span>
                <strong className="h3" style={{ fontSize: 20 }}>{t}</strong>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-link">
            <Reveal className="section-head">
              <p className="eyebrow">Where to stay</p>
              <h2 className="h2">Choose an area</h2>
            </Reveal>
            <Link className="text-link" href="/properties">All {homes.length} homes <ArrowRight size={18} /></Link>
          </div>
          <div className="link-cloud">
            {regions.map((r) => <Link key={r.name} href={`/properties/area/${regionSlug(r.name)}`}>{r.name} <span>{r.count}</span></Link>)}
          </div>
        </div>
      </section>

      <FaqSection items={guestFaqs} title="Before you book" eyebrow="Guest questions" tone="paper" />
    </>
  );
}
