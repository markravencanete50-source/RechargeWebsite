import { ArrowRight, Clock, KeyRound, Smartphone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShowcase } from "@/components/AppShowcase";
import { DiffVideo } from "@/components/DiffVideo";
import { FaqSection } from "@/components/FaqSection";
import { HomeCard } from "@/components/HomeCard";
import { JsonLd } from "@/components/JsonLd";
import { OwnerPlans } from "@/components/OwnerPlans";
import { Reveal } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { generalFaqs } from "@/content/faqs";
import { featured, homes, regions, regionSlug, reviewTotal } from "@/content/properties";
import { site } from "@/content/site";
import { allTools, toolCount } from "@/content/tools";
import { abs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const website = { "@type": "WebSite", "@id": abs("/#website"), url: site.url, name: site.name, inLanguage: "en-GB", publisher: { "@id": abs("/#organization") }, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: abs("/properties?area={area}") }, "query-input": "required name=area" } };
const showcase = ["Client dashboard", "Owner statements", "Guest communication centre", "Daily pricing", "Clean calendar", "Repairs", "Licensing", "Damage claims"];

export default function Home() {
  return (
    <>
      <JsonLd data={graph(organization, website)} />
      <section className="home-hero dark on-dark">
        <div className="wrap">
          <div className="home-hero-copy">
            <Reveal><p className="eyebrow">Serviced accommodation in Scotland</p></Reveal>
            <Reveal delay={0.05}><h1 className="h1">Find your stay. Book direct.</h1></Reveal>
            <Reveal delay={0.1}>
              <p className="lead">{homes.length} serviced homes across Scotland, from Edinburgh and Glasgow to the Borders and Skye. Book direct with Recharge and save {site.directDiscount}.</p>
            </Reveal>
          </div>
          <Reveal delay={0.15}><SearchBar /></Reveal>
          <Reveal delay={0.2}>
            <div className="quick-areas">
              <span>Popular:</span>
              {regions.slice(0, 6).map((r) => <Link key={r.name} href={`/properties?area=${encodeURIComponent(r.name)}`}>{r.name}</Link>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section proof-band">
        <div className="wrap">
          <div className="proof">
            {[
              [String(homes.length), "serviced homes"],
              [String(regions.length), "areas of Scotland"],
              [reviewTotal.toLocaleString("en-GB"), "guest reviews"],
              ["24/7", "support from a real person"],
            ].map(([n, t], i) => <Reveal key={t} delay={i * 0.06}><div><strong>{n}</strong><span>{t}</span></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-link">
            <Reveal className="section-head">
              <p className="eyebrow">Properties</p>
              <h2 className="h2">{homes.length} homes across Scotland</h2>
            </Reveal>
            <Link className="text-link" href="/properties">See all {homes.length} homes <ArrowRight size={18} /></Link>
          </div>
          <div className="homes">
            {featured.slice(0, 8).map((h, i) => <Reveal key={h.slug} delay={i * 0.06}><HomeCard home={h} /></Reveal>)}
          </div>
          <Reveal>
            <h3 className="h3" style={{ margin: "40px 0 14px", fontSize: 20 }}>Browse by area</h3>
            <div className="link-cloud">
              {regions.map((r) => <Link key={r.name} href={`/properties/area/${regionSlug(r.name)}`}>{r.name} <span>{r.count}</span></Link>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Why Recharge</p>
            <h2 className="h2">One company. One app. Support around the clock.</h2>
          </Reveal>
          <div className="cards-3">
            {[
              { href: "/owners", icon: <KeyRound size={22} />, t: "For property owners", d: "Guaranteed rent or full management, with everything visible in the app." },
              { href: "/app", icon: <Smartphone size={22} />, t: "The Recharge app", d: "Owners, guests, cleaners and maintenance work from the same app." },
              { href: "/support", icon: <Clock size={22} />, t: "24/7 support", d: "A real person on hand for guests and owners, day and night." },
            ].map((c, i) => (
              <Reveal key={c.href} delay={i * 0.08}>
                <Link className="card" href={c.href}>
                  <span className="ic">{c.icon}</span>
                  <strong className="h3">{c.t}</strong>
                  <p>{c.d}</p>
                  <span className="text-link" style={{ justifySelf: "start", marginTop: 6 }}>Find out more <ArrowRight size={16} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">What makes us different</p>
            <h2 className="h2">Most managers send a spreadsheet. <span className="accent">We built an app.</span></h2>
            <p className="lead">Owners, guests, cleaners and maintenance all work from one Recharge app, with a real person on hand 24 hours a day.</p>
          </Reveal>
          <Reveal><DiffVideo /></Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-link">
            <Reveal className="section-head">
              <p className="eyebrow">The Recharge app</p>
              <h2 className="h2">Everyone on the same page</h2>
            </Reveal>
            <Link className="text-link" href="/app">About the app <ArrowRight size={18} /></Link>
          </div>
          <AppShowcase />
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Built by Recharge</p>
            <h2 className="h2">{toolCount} tools. <span className="accent">One app.</span></h2>
            <p className="lead">Pricing, guest messages, cleaning, repairs, licensing and owner statements all run inside the Recharge app. Here are a few of them.</p>
          </Reveal>
          <Reveal>
            <div className="tool-strip">
              {showcase.map((name) => {
                const t = allTools.find((x) => x.name === name)!;
                return <span key={name}><t.icon size={16} /> {t.name}</span>;
              })}
            </div>
            <Link className="btn btn-mint" href="/app#tools">See all {toolCount} tools <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="section-link">
            <Reveal className="section-head">
              <p className="eyebrow">For owners</p>
              <h2 className="h2">Two ways to work with us</h2>
            </Reveal>
            <Link className="text-link" href="/owners">Owner options <ArrowRight size={18} /></Link>
          </div>
          <OwnerPlans />
          <Reveal>
            <div style={{ marginTop: 32 }}>
              <Link className="btn btn-primary" href="/owners#estimate">Get your free estimate <ArrowRight size={18} /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection items={generalFaqs} title="Recharge in short" eyebrow="Questions" lead="Quick answers about who we are and how we work." />
    </>
  );
}
