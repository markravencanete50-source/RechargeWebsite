import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PhotoHero } from "@/components/PhotoHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { ChildIndex, SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { showcase } from "@/content/showcase";
import { abs, breadcrumbs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About us: serviced accommodation in Scotland",
  description: "Recharge runs serviced accommodation and short lets across Scotland. We managed our own homes first, then opened the same service to owners. Meet the team and see how we work.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const { homes, regions, reviewTotal } = await getCatalog();
  const ld = graph(
    organization,
    {
      "@type": "AboutPage",
      "@id": abs("/about#page"),
      url: abs("/about"),
      name: "About Recharge",
      about: { "@id": abs("/#organization") },
    },
    breadcrumbs([{ name: "About", path: "/about" }]),
  );

  return (
    <>
      <JsonLd data={ld} />
      <PhotoHero
        shot={showcase.aboutHero}
        eyebrow="About Recharge"
        title={<>Homes run<br />properly</>}
        lead="We look after serviced accommodation across Scotland. We started with our own homes, and now we do the same for owners."
      >
        <div className="hero-actions">
          <Link className="btn btn-mint" href="/guaranteed-rent">Guaranteed rent <ArrowRight size={18} /></Link>
          <Link className="btn btn-line-light" href="/properties">See our homes</Link>
        </div>
      </PhotoHero>
      <SubNav section="/about" current="/about" />

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes we run today"], [String(regions.length), "areas across Scotland"], [reviewTotal.toLocaleString("en-GB"), "guest reviews on our homes"], ["24/7", "support for owners and guests"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split-sticky ab-intro">
          <Reveal className="split-head">
            <p className="eyebrow">Our story</p>
            <h2 className="h2">We learned the work by doing it ourselves.</h2>
          </Reveal>
          <Reveal delay={0.08} className="ab-story">
            <p>Recharge is based in Scotland. We provide fully managed serviced accommodation for property owners.</p>
            <p>We looked after our own portfolio first. That showed us what guests expect and what owners worry about, so we built the service around both.</p>
            <p>Today we handle marketing, guest messages, cleaning, maintenance and performance for every home we run. Owners follow it all in the Recharge app, and our team answers at any hour.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/owners">For owners <ArrowRight size={18} /></Link>
              <Link className="btn btn-ghost" href="/app">See the app</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">About Recharge</p><h2 className="h2">More about us</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">How we work, who stays with us, where our homes are, and how to reach us.</p></Reveal>
          </div>
          <ChildIndex section="/about" />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="ab-cta">
            <Reveal>
              <p className="eyebrow">Own a property in Scotland?</p>
              <h2 className="h2">Let your property with us</h2>
              <p className="lead">Take a fixed rent every month, or keep the earnings with full management. Either way, we run it and you stay informed.</p>
            </Reveal>
            <Reveal delay={0.1} className="hero-actions">
              <Link className="btn btn-primary" href="/guaranteed-rent">Guaranteed rent <ArrowRight size={18} /></Link>
              <Link className="btn btn-ghost" href="/owners">Compare your options</Link>
            </Reveal>
          </div>
        </div>
      </section>

    </>
  );
}
