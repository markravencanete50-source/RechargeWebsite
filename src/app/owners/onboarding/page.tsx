import { ArrowRight, Check, Plus } from "lucide-react";
import type { Metadata } from "next";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { OwnerEnquiry } from "@/components/OwnerEnquiry";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SubNav } from "@/components/SubNav";
import { conditionChecks, included, onboardingFaqs, packageItems, stages } from "@/content/onboarding";
import { packShot } from "@/content/showcase";
import { site } from "@/content/site";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/owners/onboarding";

export const metadata: Metadata = {
  title: "Owner onboarding: from enquiry to first guest",
  description: "How Recharge takes your property from a free estimate to its first guest: the estimate, your onboarding package and what each part costs, the agreement, and getting the property ready.",
  alternates: { canonical: path },
};

export default function OnboardingPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Owners", path: "/owners" }, { name: "Onboarding", path }]))} />
      <PageHero photo={packShot("S07")} eyebrow="For owners" title="Onboarding, step by step" lead="How your property goes from a free estimate to its first guest. You can follow every step in the Recharge app." />
      <SubNav section="/owners" current={path} />

      <section className="section">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">The steps</p>
            <h2 className="h2">From enquiry to first guest</h2>
            <p className="lead" style={{ marginTop: 18 }}>Eight steps, each one ticked off in the app as it is done.</p>
            <a className="btn btn-primary" href="#estimate" style={{ marginTop: 24 }}>Get your free estimate <ArrowRight size={18} /></a>
          </Reveal>
          <div className="compact-rows"><RowList items={stages} /></div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Your onboarding package</p>
            <h2 className="h2">You choose who does each part</h2>
            <p className="lead" style={{ marginTop: 18 }}>Do it yourself, or ask us to. You only pay for what you ask us to do. Open any part to see what it involves.</p>
            <p className="estimate-sub" style={{ marginTop: 24 }}>Every onboarding includes:</p>
            <ul className="checks single">{included.map((i) => <li key={i}><Check size={18} /> {i}</li>)}</ul>
          </Reveal>
          <Reveal className="faq pkg-list">
            {packageItems.map((p) => (
              <details key={p.title}>
                <summary><span className="pkg-head"><strong>{p.title}</strong>{p.price && <em>{p.price}</em>}</span><span className="plus"><Plus size={18} /></span></summary>
                <p>{p.text}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Before the first guest</p><h2 className="h2">Checked on {conditionChecks.length} points</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Before a property goes live, it is checked against each of these. Anything that fails becomes a repair job, and the property waits until it is fixed.</p></Reveal>
          </div>
          <Reveal>
            <ol className="cond-list">{conditionChecks.map((c) => <li key={c}>{c}</li>)}</ol>
          </Reveal>
        </div>
      </section>

      <FaqSection items={onboardingFaqs} title="Onboarding questions" eyebrow="Questions" tone="paper" />

      <section className="section dark on-dark" id="estimate" style={{ scrollMarginTop: 80 }}>
        <div className="wrap contact">
          <Reveal>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <p className="eyebrow">Step one</p>
              <h2 className="h2">Get your free estimate</h2>
              <p className="lead">Tell us about your property. A member of the team will be in touch with your estimate by email, usually within 48 hours. There is no obligation.</p>
            </div>
            <div className="contact-lines">
              <a href={site.phone.href}>{site.phone.display}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><OwnerEnquiry /></Reveal>
        </div>
      </section>
    </>
  );
}
