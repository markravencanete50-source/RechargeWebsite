import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FactSheet } from "@/components/FactSheet";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { StayTimeline } from "@/components/StayTimeline";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { packShot } from "@/content/showcase";
import { site } from "@/content/site";
import { houseRules, usual } from "@/content/stay";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/stay/check-in";

export const metadata: Metadata = {
  title: "Check-in, check-out and house rules",
  description: "Check-in and check-out times, what we send before you arrive, ID checks and the house rules at Recharge homes across Scotland.",
  alternates: { canonical: path },
};

export default async function CheckInPage() {
  const { homes, direct } = await getCatalog();
  const checkIn = usual(homes.map((h) => h.checkIn));
  const checkOut = usual(homes.map((h) => h.checkOut));
  const r = houseRules(homes);
  const rules = [
    { title: "No parties or loud music", note: "Please keep noise down for the neighbours, day and night", count: r.parties },
    { title: "No smoking or vaping", note: "Inside the home, and at most homes outside it too", count: r.smoking },
    { title: "Damage or mess may be charged", note: "Leave the home as you found it", count: r.damage },
    { title: "ID check before arrival", note: "A short registration through a secure link", count: r.id },
    { title: "No pets", note: "Where the listing says so", count: r.pets },
  ].filter((x) => x.count > 0).sort((a, b) => b.count - a.count);
  const faqs = [
    { q: "What time are check-in and check-out?", a: `Most homes check in from ${checkIn.value} and check out by ${checkOut.value}. ${checkIn.others || checkOut.others ? "A few homes use different times, and each home's page shows its own." : "The times are the same at every home."}` },
    { q: "When do I get my check-in details?", a: "Before you arrive. We send the address, access instructions and wifi details ahead of your stay." },
    { q: "Do I need to show ID?", a: `Some homes ask every guest to complete a short registration and ID check through a secure link before check-in. ${r.id} of our ${r.total} homes do this today, and the house rules on the home's page say if it applies.` },
    { q: "Can I check in early or leave late?", a: `Ask us. It depends on the guests before and after you. Call ${site.phone.display} or message us from the home's page.` },
    { q: "Can I extend my stay?", a: `Call ${site.phone.display} or message us. We check whether the home is free for the extra nights and how a longer stay is priced.` },
    { q: "I have left something behind. What should I do?", a: `Contact us with what it is and where you left it. Call ${site.phone.display} or email ${site.email}.` },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Stays", path: "/stay" }, { name: "Check-in and house rules", path }]))} />
      <PageHero photo={packShot("S07")} eyebrow="Stays" title="Check-in and house rules" lead="What happens from the day you book to the day you leave, and the few rules that keep our homes good for guests and neighbours." />
      <SubNav section="/stay" current={path} />

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Your stay</p><h2 className="h2">From booking to check-out</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">{checkIn.others || checkOut.others ? "These are the usual times. A few homes differ, and each home's page shows its own." : "The same times at every home."}</p></Reveal>
          </div>
          <StayTimeline stops={[
            { mark: "Book", title: "Choose your home", text: `Pick the home and dates and book direct. It costs ${direct} less than on the booking sites.` },
            { mark: "Before", title: "Your details arrive", text: "We send the address, access instructions and wifi. Some homes also ask each guest for a short registration and ID check." },
            { mark: checkIn.value, title: "Let yourself in", text: "The home is cleaned, checked and ready, with the beds made up." },
            { mark: "During", title: "Make yourself at home", text: <>If anything is wrong, call <a href={site.phone.href}>{site.phone.display}</a> at any hour, or <Link href="/support/report-a-problem">report a problem</Link>.</> },
            { mark: checkOut.value, title: "Check out", text: "Leave the keys as instructed and we take it from there. Want to stay longer? Ask us before your last night." },
          ]} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap spec">
          <Reveal>
            <p className="eyebrow">House rules</p>
            <h2 className="h2">A few rules, for everyone&apos;s sake</h2>
            <p className="lead" style={{ marginTop: 18 }}>Our homes sit among neighbours, so the rules are mostly about noise and care. These are counted from our own listings. Each home&apos;s page shows its exact rules.</p>
          </Reveal>
          <FactSheet items={rules} total={r.total} />
        </div>
      </section>

      <section className="section">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Arriving</p>
            <h2 className="h2">Before you arrive</h2>
            <p className="lead">Everything you need reaches you before the day, so there is nothing to collect.</p>
          </Reveal>
          <RowList items={[
            { title: "The address and how to get in", text: "Sent ahead of your stay, with the access instructions for that home." },
            { title: "Wifi details", text: "In the same message, so you are connected as soon as you are in." },
            { title: "Registration, where a home asks for it", text: "A short form and ID check through a secure link. The home's house rules say if it applies." },
            { title: "Parking", text: "Each home's page says whether parking is free, private or on the street." },
          ]} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Leaving</p>
            <h2 className="h2">Checking out</h2>
            <p className="lead">No need to strip the beds or do a deep clean. The team does that before the next guests.</p>
          </Reveal>
          <RowList items={[
            { title: `Leave by ${checkOut.value}`, text: "Or by the time on your home's page, if it differs." },
            { title: "Leave the keys as instructed", text: "Your check-in message says where." },
            { title: "Tell us about anything broken", text: "We would rather know now than find it later. Accidents happen." },
            { title: "Forgotten something?", text: `Call ${site.phone.display} or email ${site.email} and tell us where you left it.` },
          ]} />
        </div>
      </section>

      <FaqSection items={faqs} title="Arriving and leaving" eyebrow="Questions" />

      <section className="section paper">
        <div className="wrap">
          <div className="note-line">
            <p><strong>Something wrong during your stay?</strong> Tell us which home and what is wrong, and the team on duty replies.</p>
            <Link className="text-link" href="/support/report-a-problem">Report a problem <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
