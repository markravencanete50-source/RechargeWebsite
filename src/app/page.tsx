import { ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShowcase } from "@/components/AppShowcase";
import { AreaIndex } from "@/components/AreaIndex";
import { DiffVideo } from "@/components/DiffVideo";
import { FaqSection } from "@/components/FaqSection";
import { HomeCard } from "@/components/HomeCard";
import { JsonLd } from "@/components/JsonLd";
import { OwnerPlans } from "@/components/OwnerPlans";
import { PhotoHero } from "@/components/PhotoHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { ToolMarquee } from "@/components/ToolMarquee";
import { WhyChoose } from "@/components/WhyChoose";
import { generalFaqs } from "@/content/faqs";
import { featured, homes, regions, reviewTotal } from "@/content/properties";
import { showcase } from "@/content/showcase";
import { site } from "@/content/site";
import { toolCount } from "@/content/tools";
import { guestReasons, ownerReasons } from "@/content/why";
import { abs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const website = { "@type": "WebSite", "@id": abs("/#website"), url: site.url, name: site.name, inLanguage: "en-GB", publisher: { "@id": abs("/#organization") }, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: abs("/properties?area={area}") }, "query-input": "required name=area" } };

export default function Home() {
  return (
    <>
      <JsonLd data={graph(organization, website)} />
      <PhotoHero
        className="home"
        shots={showcase.homeHero}
        eyebrow="Serviced accommodation in Scotland"
        title={<>Find your stay.<br />Book direct.</>}
        lead={`${homes.length} serviced homes across Scotland, from Edinburgh and Glasgow to the Borders and Skye. Book direct with Recharge and save ${site.directDiscount}.`}
      >
        <SearchBar />
        <div className="quick-areas">
          <span>Popular:</span>
          {regions.slice(0, 6).map((r) => <Link key={r.name} href={`/properties?area=${encodeURIComponent(r.name)}`}>{r.name}</Link>)}
        </div>
      </PhotoHero>

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "serviced homes"], [String(regions.length), "areas of Scotland"], [reviewTotal.toLocaleString("en-GB"), "guest reviews"], ["24/7", "support from a real person"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Properties</p><h2 className="h2">Our most stayed-in homes</h2></Reveal>
            <Reveal delay={0.08}><Link className="text-link" href="/properties">See all {homes.length} homes <ArrowRight size={18} /></Link></Reveal>
          </div>
          <div className="homes homes-scroll">
            {featured.slice(0, 8).map((h, i) => <Reveal key={h.slug} delay={(i % 4) * 0.06}><HomeCard home={h} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Why Recharge</p><h2 className="h2">Chosen by owners. Booked by guests.</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">One company runs both sides: the homes guests book and the service owners rely on. Here is why each of them picks us.</p></Reveal>
          </div>
          <WhyChoose owners={ownerReasons} guests={guestReasons} ownerShot={showcase.owners} guestShot={showcase.guests} />
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">What makes us different</p><h2 className="h2">Most managers send a spreadsheet. <span className="accent">We built an app.</span></h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Owners, guests, cleaners and maintenance all work from one Recharge app, with a real person on hand 24 hours a day.</p></Reveal>
          </div>
          <Reveal><DiffVideo /></Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">The Recharge app</p><h2 className="h2">Everyone on the same page</h2></Reveal>
            <Reveal delay={0.08}><Link className="text-link" href="/app">About the app <ArrowRight size={18} /></Link></Reveal>
          </div>
          <AppShowcase />
        </div>
      </section>

      <section className="section dark on-dark tools-band">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Behind every home</p>
            <h2 className="h2">{toolCount} tools. <span className="accent">One team.</span></h2>
            <p className="lead">Pricing, guest messages, cleaning, repairs, licensing and statements all run inside the Recharge app. Owners see their own client portal.</p>
            <Link className="btn btn-mint" href="/app#tools">See how the team works <ArrowRight size={18} /></Link>
          </Reveal>
          <ToolMarquee />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">For owners</p><h2 className="h2">Two ways to work with us</h2></Reveal>
            <Reveal delay={0.08}><Link className="btn btn-primary" href="/owners#estimate">Get your free estimate <ArrowRight size={18} /></Link></Reveal>
          </div>
          <OwnerPlans />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Where we are</p><h2 className="h2">From the Borders to Skye</h2></Reveal>
            <Reveal delay={0.08}><Link className="text-link" href="/stay">All {regions.length} areas <ArrowRight size={18} /></Link></Reveal>
          </div>
          <AreaIndex limit={10} />
        </div>
      </section>

      <section className="call-band dark on-dark">
        <div className="wrap call-band-inner">
          <Reveal><p className="call-band-big">24/7</p></Reveal>
          <Reveal delay={0.08}>
            <h2 className="h2">Someone is always there.</h2>
            <p className="lead">Guests and owners reach a real person at any hour.</p>
          </Reveal>
          <Reveal delay={0.16}><a className="btn btn-mint" href={site.phone.href}><Phone size={18} /> {site.phone.display}</a></Reveal>
        </div>
      </section>

      <FaqSection items={generalFaqs} title="Recharge in short" eyebrow="Questions" lead="Quick answers about who we are and how we work." tone="paper" />
    </>
  );
}
