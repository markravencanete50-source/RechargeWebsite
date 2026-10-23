import { ArrowRight, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { OwnerEnquiry } from "@/components/OwnerEnquiry";
import { OwnerPlans } from "@/components/OwnerPlans";
import { OwnerVoices } from "@/components/OwnerVoices";
import { PhotoHero } from "@/components/PhotoHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { RentVsBookings } from "@/components/RentVsBookings";
import { Steps } from "@/components/Steps";
import { getCatalog } from "@/content/catalog";
import { benefits, guaranteedFaqs, landlords, rentSteps, wePay, youKeep } from "@/content/guaranteed";
import { showcase } from "@/content/showcase";
import { site } from "@/content/site";
import { abs, breadcrumbs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Guaranteed rent for Scottish landlords",
  description: "A fixed rent paid on time every month, whether your property is booked or not. We pay the bills, look after repairs and run your property. Free proposal for landlords in Glasgow, Edinburgh and across Scotland.",
  alternates: { canonical: "/guaranteed-rent" },
};

export default async function GuaranteedRentPage() {
  const { homes, regions, reviewTotal } = await getCatalog();
  const regionNames = regions.map((r) => r.name);
  const faqs = guaranteedFaqs(regionNames);
  const ld = graph(
    organization,
    {
      "@type": "Service",
      "@id": abs("/guaranteed-rent#service"),
      name: "Guaranteed rent for landlords",
      serviceType: "Guaranteed rent and serviced accommodation management",
      description: "A fixed monthly rent paid to the property owner whether the property is occupied or not. Recharge pays the running costs, looks after repairs and runs the property as serviced accommodation.",
      provider: { "@id": abs("/#organization") },
      areaServed: regionNames.map((n) => ({ "@type": "Place", name: `${n}, Scotland` })),
      url: abs("/guaranteed-rent"),
    },
    breadcrumbs([{ name: "Owners", path: "/owners" }, { name: "Guaranteed rent", path: "/guaranteed-rent" }]),
  );

  return (
    <>
      <JsonLd data={ld} />
      <PhotoHero
        shot={showcase.ownerHero}
        eyebrow="Guaranteed rent"
        title={<>Paid on time,<br />every month</>}
        lead="A fixed rent for your property, whether it is booked or not. We pay the bills, look after repairs and run the home as serviced accommodation."
      >
        <div className="hero-actions">
          <a className="btn btn-mint" href="#proposal">Get your free proposal <ArrowRight size={18} /></a>
          <a className="btn btn-line-light" href="#how">How it works</a>
        </div>
      </PhotoHero>

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes we run today"], [String(regions.length), "areas across Scotland"], [reviewTotal.toLocaleString("en-GB"), "guest reviews on our homes"], ["24/7", "support for owners and guests"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap gr-split">
          <Reveal className="gr-intro">
            <p className="eyebrow">What is guaranteed rent?</p>
            <h2 className="h2">A fixed income from a property that earns what it earns.</h2>
            <p className="lead">We pay you the same rent every month. We take on the running of the property, and the empty weeks become our concern, not yours.</p>
            <p className="lead">You keep your property and its long-term value. You give up the guesswork, the cleaning rota and the late-night messages.</p>
            <a className="btn btn-primary" href="#proposal">Get your free proposal <ArrowRight size={18} /></a>
          </Reveal>
          <Reveal delay={0.1}><RentVsBookings /></Reveal>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">What you get</p><h2 className="h2">Six reasons landlords choose it</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Every point below is written into the agreement, so you know it before you sign.</p></Reveal>
          </div>
          <ol className="clauses">
            {benefits.map((b, i) => (
              <Reveal as="li" key={b.title} delay={0.05 * (i % 3)} className="clause">
                <span className="clause-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Who pays for what</p>
            <h2 className="h2">We carry the costs. You keep the control.</h2>
          </Reveal>
          <div className="ledger">
            <Reveal className="ledger-col">
              <p className="ledger-head">We pay for</p>
              <ul>{wePay.map((t) => <li key={t}>{t}</li>)}</ul>
            </Reveal>
            <Reveal className="ledger-col" delay={0.1}>
              <p className="ledger-head">You keep</p>
              <ul>{youKeep.map((t) => <li key={t}>{t}</li>)}</ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Your options</p><h2 className="h2">Fixed rent, or the full earnings?</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Guaranteed rent is one of two ways to work with us. Choose the one that suits you, and change your mind at renewal.</p></Reveal>
          </div>
          <OwnerPlans />
          <p className="gr-note">Not sure which is better for your property? <Link className="text-link" href="/owners#calculator">Try the earnings calculator <ArrowRight size={16} /></Link></p>
        </div>
      </section>

      <section className="section" id="how" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2">From first message to first payment</h2>
          </Reveal>
          <Steps items={rentSteps} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">In their words</p>
            <h2 className="h2">What landlords say</h2>
          </Reveal>
          <OwnerVoices items={landlords} />
        </div>
      </section>

      <section className="section dark on-dark" id="proposal" style={{ scrollMarginTop: 80 }}>
        <div className="wrap contact">
          <Reveal>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <p className="eyebrow">Free guaranteed rent proposal</p>
              <h2 className="h2">What rent could we guarantee you?</h2>
              <p className="lead">Tell us about your property. A member of the team will come back with a guaranteed rent proposal. It is free, and there is no obligation.</p>
            </div>
            <div className="contact-lines">
              <a href={site.phone.href}><span className="ic"><Phone size={20} /></span>{site.phone.display}</a>
              <a href={`mailto:${site.email}`}><span className="ic"><Mail size={20} /></span>{site.email}</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><OwnerEnquiry proposal /></Reveal>
        </div>
      </section>

      <FaqSection items={faqs} title="Guaranteed rent questions" eyebrow="Questions" more={false} />

      <section className="section paper">
        <div className="wrap">
          <h2 className="h3" style={{ marginBottom: 16 }}>Keep reading</h2>
          <div className="next-links">
            <Link href="/owners"><strong>All owner options <ArrowRight size={16} /></strong><span>Compare guaranteed rent with full management.</span></Link>
            <Link href="/owners#statement"><strong>Example statement <ArrowRight size={16} /></strong><span>See where every pound goes each month.</span></Link>
            <Link href="/about"><strong>About Recharge <ArrowRight size={16} /></strong><span>Who we are and how we work.</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
