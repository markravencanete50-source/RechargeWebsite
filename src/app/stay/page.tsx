import { ArrowRight, Camera, Clock, MessageSquareText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AreaIndex } from "@/components/AreaIndex";
import { FaqSection } from "@/components/FaqSection";
import { FactSheet } from "@/components/FactSheet";
import { StayTimeline } from "@/components/StayTimeline";
import { JsonLd } from "@/components/JsonLd";
import { PhotoHero } from "@/components/PhotoHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { ReasonList } from "@/components/WhyChoose";
import { SearchBar } from "@/components/SearchBar";
import { TripGrid } from "@/components/TripGrid";
import { guestFaqs } from "@/content/faqs";
import { getCatalog } from "@/content/catalog";
import { showcase } from "@/content/showcase";
import { site, withDirect } from "@/content/site";
import { guestReasons } from "@/content/why";
import { breadcrumbs, graph } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const { direct } = await getCatalog();
  return {
    title: "Stays",
    description: `Serviced apartments and homes across Scotland for city breaks, work trips, contractors and families. Book direct and save ${direct}.`,
    alternates: { canonical: "/stay" },
  };
}

// The most common value in a list, and how many homes differ from it.
function usual(values: string[]) {
  const tally = new Map<string, number>();
  for (const v of values) if (v) tally.set(v, (tally.get(v) ?? 0) + 1);
  const [value = "", n = 0] = [...tally].sort((a, b) => b[1] - a[1])[0] ?? [];
  return { value, others: values.length - n };
}

export default async function StayPage() {
  const { homes, regions, towns, reviewTotal, priceSteps, direct } = await getCatalog();
  const has = (re: RegExp) => homes.filter((h) => h.amenities.some((a) => re.test(a))).length;
  const facts = [
    { title: "Fresh linen and towels", note: "Beds made up before you arrive", count: has(/linen|towel|essentials/i) },
    { title: "A kitchen", note: "Most with an oven, microwave and kettle", count: has(/kitchen/i) },
    { title: "Heating and hot water", note: "Whatever the weather", count: has(/heating/i) },
    { title: "Suitable for children", note: "Check the beds in each room", count: has(/child|famil/i) },
    { title: "A washing machine", note: "Handy for longer stays", count: has(/washing machine|washer/i) },
    { title: "Wifi", note: "Details come with your check-in information", count: has(/wi-?fi|wireless|internet/i) },
    { title: "Parking", note: "Free, private or on the street", count: has(/parking/i) },
  ].filter((f) => f.count > 0).sort((a, b) => b.count - a.count);
  const checkIn = usual(homes.map((h) => h.checkIn ?? ""));
  const checkOut = usual(homes.map((h) => h.checkOut ?? ""));
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Stays", path: "/stay" }]))} />
      <PhotoHero shot={showcase.stayHero} eyebrow="Stays" title={<>A whole home,<br />ready when you arrive</>} lead={`${homes.length} serviced homes across Scotland for city breaks, work trips and families. Book direct and save ${direct}.`}>
        <SearchBar data={{ regions, towns, priceSteps }} />
      </PhotoHero>

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes to choose from"], [String(regions.length), "areas of Scotland"], [reviewTotal.toLocaleString("en-GB"), "reviews from past guests"], ["24/7", "help from a real person"]]} />
        </div>
      </section>

      <section className="section" id="book-direct" style={{ scrollMarginTop: 80 }}>
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Why guests choose Recharge</p>
            <h2 className="h2">Save <span className="big-figure">{direct}</span> and deal with us, not a platform.</h2>
            <p className="lead">Same home, same dates, a better rate. And the team that runs the home is the team you talk to.</p>
            <Link className="btn btn-primary" href="/properties">Find a home <ArrowRight size={18} /></Link>
          </Reveal>
          <ReasonList items={withDirect(guestReasons, direct)} />
        </div>
      </section>

      <section className="section paper" id="trips" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Who stays with us</p><h2 className="h2">Homes for every kind of trip</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">A home rather than a hotel room. Full kitchens, space to spread out and parking at most of our homes.</p></Reveal>
          </div>
          <TripGrid trips={[
            { title: "Families and groups", text: "Homes that sleep up to 10, with room for everyone.", href: "/properties?guests=6", cta: "Homes for 6 or more", shot: showcase.families },
            { title: "Contractors and crews", text: "Whole homes with parking and kitchens.", href: "/properties?beds=3", cta: "3 bedrooms or more", shot: showcase.contractors },
            { title: "Business travel", text: "Quiet, central homes with support at any hour.", href: "/properties?area=Edinburgh", cta: "Homes in Edinburgh", shot: showcase.business },
            { title: "Longer stays", text: "Relocations, renovations and insurance stays.", href: "/properties", cta: "See every home", shot: showcase.longStays },
          ]} />
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap media-split">
          <Reveal className="media-frame">
            {showcase.checked && <Image src={showcase.checked.src} alt={showcase.checked.caption} fill sizes="(max-width: 900px) 100vw, 50vw" />}
          </Reveal>
          <div>
            <Reveal className="section-head">
              <p className="eyebrow">Every stay</p>
              <h2 className="h2">Checked before you arrive. Looked after while you are there.</h2>
            </Reveal>
            <RowList items={[
              { icon: <Camera size={18} />, title: "Photo-checked cleans", text: "Each clean is created from your booking and finished with photo evidence." },
              { icon: <MessageSquareText size={18} />, title: "Fast replies", text: "Guest messages are tracked with live response timers, day and night." },
              { icon: <Clock size={18} />, title: "Problems fixed", text: "A fault you report becomes a repair job, followed to the finish." },
            ]} />
          </div>
        </div>
      </section>

      <section className="section paper" id="good-to-know" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Your stay</p><h2 className="h2">From booking to check-out</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">{checkIn.others || checkOut.others ? "These are the usual times. A few homes differ, and each home's page shows its own." : "The same times at every home."}</p></Reveal>
          </div>
          <StayTimeline stops={[
            { mark: "Book", title: "Choose your home", text: `Pick the home and dates and book direct. It costs ${direct} less than on the booking sites.` },
            { mark: "Before", title: "Your details arrive", text: "We send the address, access instructions and wifi. Some homes also ask each guest for a short registration and ID check." },
            { mark: checkIn.value, title: "Let yourself in", text: "The home is cleaned, checked and ready, with the beds made up." },
            { mark: "During", title: "Make yourself at home", text: <>No parties, no loud music, and no smoking or vaping inside or out. If anything is wrong, call <a href={site.phone.href}>{site.phone.display}</a> at any hour.</> },
            { mark: checkOut.value, title: "Check out", text: "Leave the keys as instructed and we take it from there. Want to stay longer? Ask us before your last night." },
          ]} />
        </div>
      </section>

      <section className="section" id="every-home" style={{ scrollMarginTop: 80 }}>
        <div className="wrap spec">
          <Reveal className="spec-media">
            {showcase.kitchen && <Image src={showcase.kitchen.src} alt={showcase.kitchen.caption} fill sizes="(max-width: 900px) 100vw, 45vw" />}
          </Reveal>
          <div className="spec-body">
            <Reveal>
              <p className="eyebrow">In the home</p>
              <h2 className="h2">What our homes have</h2>
              <p className="lead">Counted from our own listings. Each home&apos;s page lists everything it has.</p>
            </Reveal>
            <FactSheet items={facts} total={homes.length} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Where to stay</p><h2 className="h2">{regions.length} areas, {homes.length} homes</h2></Reveal>
            <Reveal delay={0.08}><Link className="text-link" href="/properties">Search all homes <ArrowRight size={18} /></Link></Reveal>
          </div>
          <AreaIndex />
        </div>
      </section>

      <FaqSection items={withDirect(guestFaqs, direct)} title="Before you book" eyebrow="Guest questions" tone="paper" id="questions" />
    </>
  );
}
