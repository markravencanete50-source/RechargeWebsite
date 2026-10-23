import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/JsonLd";
import { PhotoHero } from "@/components/PhotoHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { getCatalog } from "@/content/catalog";
import { partners } from "@/content/partners";
import { showcase } from "@/content/showcase";
import { abs, breadcrumbs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About us: serviced accommodation in Scotland",
  description: "Recharge runs serviced accommodation and short lets across Scotland. We managed our own homes first, then opened the same service to owners. Meet the team and see how we work.",
  alternates: { canonical: "/about" },
};

const principles = [
  { title: "Reliability", text: "Owners are paid on time and guests are looked after at any hour. We build the business so that it holds up on a bad day, not only a good one." },
  { title: "Transparency", text: "Owners see every booking, cost and payout in their own portal. We ask before we spend, and we show our working." },
  { title: "Results", text: "Prices are set from the market, not from habit. We review them every day and learn from every stay." },
];

const guests = [
  { shot: showcase.business, label: "For work", title: "Business trips and contracts", text: "Quiet, well-equipped homes for people working away. Fast wifi, a proper desk and a kitchen that works." },
  { shot: showcase.families, label: "For leisure", title: "Holidays and weekends", text: "Space for families and groups, close to what they came to see, with everything ready on arrival." },
  { shot: showcase.longStays, label: "For life situations", title: "Moves, repairs and in-between", text: "A comfortable home for weeks or months while someone relocates, renovates or waits for the keys." },
];

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
            <Reveal><p className="eyebrow">How we work</p><h2 className="h2">What we hold to</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Every decision we make comes back to one of these.</p></Reveal>
          </div>
          <div className="tenets">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={0.08 * i} className="tenet">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Who stays with us</p><h2 className="h2">Guests with a reason to be here</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Our homes suit people travelling for work, for a break, or because life has moved them for a while.</p></Reveal>
          </div>
          <div className="ab-guests">
            {guests.map((g, i) => (
              <Reveal key={g.title} delay={0.08 * i} className="ab-guest">
                {g.shot && <Image src={g.shot.src} alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />}
                <div className="ab-guest-copy">
                  <span className="eyebrow">{g.label}</span>
                  <strong>{g.title}</strong>
                  <span>{g.text}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="gr-note"><Link className="text-link" href="/stay">Read about staying with us <ArrowRight size={16} /></Link></p>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap ab-partners">
          <Reveal className="ab-partners-copy">
            <p className="eyebrow">Our trusted partners</p>
            <h2 className="h2">Find us wherever you book</h2>
            <p className="lead">Our homes are listed on the major booking platforms, and you can book direct on this website too.</p>
            <Link className="text-link" href="/properties">Book direct and save <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="ab-logos">
              {partners.map((p) => (
                <li key={p.name}>{p.logo ? <Image src={p.logo} alt={p.name} width={140} height={48} /> : p.name}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="ab-cta on-dark">
            <Reveal>
              <p className="eyebrow">Own a property in Scotland?</p>
              <h2 className="h2">Let your property with us</h2>
              <p className="lead">Take a fixed rent every month, or keep the earnings with full management. Either way, we run it and you stay informed.</p>
            </Reveal>
            <Reveal delay={0.1} className="hero-actions">
              <Link className="btn btn-mint" href="/guaranteed-rent">Guaranteed rent <ArrowRight size={18} /></Link>
              <Link className="btn btn-line-light" href="/owners">Compare your options</Link>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactSection title="Talk to the team" lead="Ask us anything about a stay, or tell us about your property. A real person will reply." />
    </>
  );
}
