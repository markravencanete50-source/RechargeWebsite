import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DiffVideo } from "@/components/DiffVideo";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { Journey } from "@/components/Journey";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SubNav } from "@/components/SubNav";
import { appPages, teamOf } from "@/content/app-pages";
import { appFaqs } from "@/content/faqs";
import { journey, toolCount } from "@/content/tools";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/app/how-it-works";

export const metadata: Metadata = {
  title: "How the Recharge app works",
  description: "One booking followed through the Recharge app, from the guest's booking to the owner's statement, with the tool that handles each step.",
  alternates: { canonical: path },
};

export default function HowItWorksPage() {
  const ld = graph(
    { "@type": "HowTo", name: "How one booking moves through the Recharge app", step: journey.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text })) },
    breadcrumbs([{ name: "The app", path: "/app" }, { name: "How it works", path }]),
  );
  return (
    <>
      <JsonLd data={ld} />
      <PageHero eyebrow="The app" title="How it works" lead={`Follow one booking through the app. Each step is handled by one of its ${toolCount} tools, so nothing depends on someone remembering.`} />
      <SubNav section="/app" current={path} />

      <section className="section dark on-dark">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Step by step</p>
            <h2 className="h2">One booking, start to finish</h2>
            <p className="lead">From the moment a guest books to the moment the owner is paid.</p>
          </Reveal>
          <Journey />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">The teams</p><h2 className="h2">Who handles each part</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Five teams work from the same app. Each has its own page.</p></Reveal>
          </div>
          <ul className="child-index">
            {appPages.map((p) => {
              const t = teamOf(p);
              return <li key={p.slug}><Link href={`/app/${p.slug}`}><strong>{p.title}</strong><span>{t.tools.length} tools · {t.lead}</span><em aria-hidden>→</em></Link></li>;
            })}
          </ul>
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Watch</p><h2 className="h2">Why Recharge is different</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">How the app keeps owners, guests, cleaners and maintenance on the same page.</p></Reveal>
          </div>
          <Reveal><DiffVideo /></Reveal>
        </div>
      </section>

      <FaqSection items={appFaqs} title="About the app" eyebrow="Questions" />

      <section className="section paper">
        <div className="wrap">
          <div className="note-line" style={{ marginTop: 0 }}>
            <p><strong>An owner?</strong> See what you would see in your own client portal.</p>
            <Link className="text-link" href="/app/owner-portal">The owner portal <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
