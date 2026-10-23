import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Steps } from "@/components/Steps";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { ukToday } from "@/content/discounts";
import { packShot } from "@/content/showcase";
import { site } from "@/content/site";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/stay/book-direct";

export async function generateMetadata(): Promise<Metadata> {
  const { direct } = await getCatalog();
  return {
    title: `Book direct and save ${direct}`,
    description: `Book a Recharge home on this website and pay ${direct} less than on the booking sites. Nothing is charged until the team confirms your request.`,
    alternates: { canonical: path },
  };
}

const day = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long" });

// The discounts live today. Worked out in a cache that refreshes with the catalogue and at least hourly, so an offer appears and
// ends on the right day.
async function liveDiscounts() {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  const { discounts } = await getCatalog();
  const today = ukToday();
  const live = discounts.filter((d) => d.active && (!d.starts_on || d.starts_on <= today) && (!d.ends_on || d.ends_on >= today));
  return { offers: live.filter((d) => d.kind === "offer").sort((a, b) => b.percent - a.percent), newGuest: live.find((d) => d.kind === "new_customer") };
}

export default async function BookDirectPage() {
  const { direct } = await getCatalog();
  const { offers, newGuest } = await liveDiscounts();
  const rows: [string, string, string][] = [
    ["Price", `${direct} less on the same home and dates`, "The booking site's price"],
    ...(newGuest ? [["First stay", `A further ${newGuest.percent}% off the nightly price`, "Not available"] as [string, string, string]] : []),
    ["Who you deal with", "The team that runs the home, from the first message", "The booking site first, then us"],
    ["Paying", "Nothing is charged until we confirm your request", "Usually paid when you book"],
    ["Long stays", "Ask us for a long-stay price", "Set by the booking site"],
  ];
  const faqs = [
    { q: "How do I book direct?", a: "Open the home you like on our Properties page, choose your dates and send a request. The team checks the dates and confirms the price with you." },
    { q: "Am I charged when I send a request?", a: "No. Nothing is charged until the team has confirmed your request." },
    { q: "Is the direct saving the same for every home?", a: `Yes. Booking on this website costs ${direct} less than the same home and dates on the booking sites.` },
    ...(newGuest ? [{ q: "What is the new guest discount?", a: `The first time an email address sends a booking request on this website, it gets a further ${newGuest.percent}% off the nightly price. It is added to any offer that is running.` }] : []),
    { q: "Can I still book on Airbnb or Booking.com?", a: "Yes. Our homes are listed there too. Booking here gets you the direct saving and puts you straight in touch with the team that runs the home." },
    { q: "Do discounts apply to the cleaning fee?", a: "No. Discounts come off the nightly price, not the cleaning fee." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Stays", path: "/stay" }, { name: "Book direct", path }]))} />
      <PageHero photo={packShot("R08")} eyebrow="Stays" title={<>Book direct and save {direct}</>} lead="The same homes are on the big booking sites. Booking here costs less, and you deal with the people who run the home." />
      <SubNav section="/stay" current={path} />

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Side by side</p><h2 className="h2">Booking here or on a booking site</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">The home, the cleaning and the support are the same. The difference is the price and who you talk to.</p></Reveal>
          </div>
          <Reveal className="compare">
            <div className="compare-row compare-top" role="row">
              <span aria-hidden />
              <div className="pick"><small>This website</small><strong>Book direct</strong></div>
              <div><small>Airbnb, Booking.com and others</small><strong>A booking site</strong></div>
            </div>
            {rows.map(([label, us, them]) => (
              <div key={label} className="compare-row" role="row">
                <span className="compare-label" role="rowheader">{label}</span>
                <span role="cell" className="pick"><em>Book direct</em>{us}</span>
                <span role="cell"><em>A booking site</em>{them}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Today</p><h2 className="h2">Offers running now</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">When more than one offer fits your stay, the biggest one counts. The new guest discount is added on top.</p></Reveal>
          </div>
          <ul className="offer-list">
            <li><strong>{direct} off</strong><span>Book direct saving</span><small>Every home, every date</small></li>
            {newGuest && <li><strong>{newGuest.percent}% off</strong><span>{newGuest.label}</span><small>Your first request from this website</small></li>}
            {offers.map((o) => (
              <li key={o.id}>
                <strong>{o.percent}% off</strong>
                <span>{o.label}</span>
                <small>{[o.region ?? "Every area", o.starts_on && o.ends_on ? `${day(o.starts_on)} to ${day(o.ends_on)}` : o.ends_on ? `Until ${day(o.ends_on)}` : "No end date"].join(" · ")}</small>
              </li>
            ))}
          </ul>
          {offers.length === 0 && <p className="gr-note">No extra offers are running today. The direct saving applies to every stay.</p>}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2">From search to front door</h2>
          </Reveal>
          <Steps items={[
            ["Choose a home and dates", "Each home shows its live price and the nights that are free."],
            ["Send a request", "A chat with the team opens with your dates filled in. Nothing is charged yet."],
            ["We confirm", "The team checks the dates and confirms the price, with any discounts taken off."],
            ["Your details arrive", "The address, access instructions and wifi come before your stay."],
          ]} />
          <div className="hero-actions" style={{ marginTop: 40 }}>
            <Link className="btn btn-primary" href="/properties">Find a home <ArrowRight size={18} /></Link>
            <a className="btn btn-ghost" href={site.phone.href}>Call {site.phone.display}</a>
          </div>
        </div>
      </section>

      <FaqSection items={faqs} title="Booking direct" eyebrow="Questions" tone="paper" />
    </>
  );
}
