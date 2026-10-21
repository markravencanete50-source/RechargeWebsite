import { ArrowRight, Camera, Clock, KeyRound, MessageSquareText, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AreaIndex } from "@/components/AreaIndex";
import { FaqSection } from "@/components/FaqSection";
import { FloatNotes } from "@/components/FloatNotes";
import { JsonLd } from "@/components/JsonLd";
import { PhotoHero } from "@/components/PhotoHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SearchBar } from "@/components/SearchBar";
import { Steps } from "@/components/Steps";
import { TripGrid } from "@/components/TripGrid";
import { guestFaqs } from "@/content/faqs";
import { homes, regions, reviewTotal } from "@/content/properties";
import { showcase } from "@/content/showcase";
import { site } from "@/content/site";
import { breadcrumbs, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Stays",
  description: `Serviced apartments and homes across Scotland for city breaks, work trips, contractors and families. Book direct and save ${site.directDiscount}.`,
  alternates: { canonical: "/stay" },
};

export default function StayPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Stays", path: "/stay" }]))} />
      <PhotoHero shot={showcase.stayHero} eyebrow="Stays" title={<>A whole home,<br />ready when you arrive</>} lead={`${homes.length} serviced homes across Scotland for city breaks, work trips and families. Book direct and save ${site.directDiscount}.`}>
        <SearchBar />
      </PhotoHero>

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes to choose from"], [String(regions.length), "areas of Scotland"], [reviewTotal.toLocaleString("en-GB"), "reviews from past guests"], ["24/7", "help from a real person"]]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Why book direct</p>
            <h2 className="h2">Save <span className="big-figure">{site.directDiscount}</span> and deal with us, not a platform.</h2>
            <p className="lead">Same home, same dates, a better rate. And the team that runs the home is the team you talk to.</p>
            <Link className="btn btn-primary" href="/properties">Find a home <ArrowRight size={18} /></Link>
          </Reveal>
          <RowList items={[
            { title: `${site.directDiscount} off every direct booking`, text: "Booking with Recharge costs less than booking the same home on a platform." },
            { title: "Cleaned to a checklist", text: "Every clean is finished with photos in the Recharge app before you arrive." },
            { title: "Help at any hour", text: "Message or call 24/7. Urgent problems go straight to our maintenance team." },
            { title: "Long stays welcome", text: "Most homes offer long-stay discounts on request. Ideal for contractors and relocations." },
          ]} />
        </div>
      </section>

      <section className="section paper">
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

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Your stay</p>
            <h2 className="h2">Four steps, no surprises</h2>
          </Reveal>
          <Steps items={[
            ["Book", "Choose your home and dates and book direct."],
            ["Get your details", "We send the address, access instructions and wifi before you arrive."],
            ["Arrive", "Let yourself in. The home is cleaned and ready."],
            ["Check out", "Leave the keys as instructed. We take it from there."],
          ]} />
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap media-split">
          <Reveal className="media-frame">
            {showcase.checked && <Image src={showcase.checked.src} alt={showcase.checked.caption} fill sizes="(max-width: 900px) 100vw, 50vw" />}
            <FloatNotes notes={[
              { icon: <Camera size={16} />, text: "Clean finished, photos uploaded" },
              { icon: <Sparkles size={16} />, text: "Fresh linen and towels" },
              { icon: <KeyRound size={16} />, text: "Access details sent" },
            ]} />
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

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Where to stay</p><h2 className="h2">{regions.length} areas, {homes.length} homes</h2></Reveal>
            <Reveal delay={0.08}><Link className="text-link" href="/properties">Search all homes <ArrowRight size={18} /></Link></Reveal>
          </div>
          <AreaIndex />
        </div>
      </section>

      <FaqSection items={guestFaqs} title="Before you book" eyebrow="Guest questions" tone="paper" />
    </>
  );
}
