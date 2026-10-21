import { ArrowRight, Clock, KeyRound, Smartphone } from "lucide-react";
import Link from "next/link";
import { AppShowcase } from "@/components/AppShowcase";
import { DiffVideo } from "@/components/DiffVideo";
import { HomeCard } from "@/components/HomeCard";
import { OwnerPlans } from "@/components/OwnerPlans";
import { Reveal } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { featured, homes, regions } from "@/content/properties";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
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

      <section className="section">
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
              <Link className="btn btn-primary" href="/owners#contact">Get your free estimate <ArrowRight size={18} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
