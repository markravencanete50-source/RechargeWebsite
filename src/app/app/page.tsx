import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShowcase } from "@/components/AppShowcase";
import { DiffVideo } from "@/components/DiffVideo";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { Journey } from "@/components/Journey";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ToolsShowcase } from "@/components/ToolsShowcase";
import { appFaqs } from "@/content/faqs";
import { teams, toolCount } from "@/content/tools";
import { abs, breadcrumbs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The Recharge app",
  description: `The Recharge app has ${toolCount} tools for owners, guest support, cleaners, maintenance and accounts: pricing, statements, cleans, repairs and licensing in one place.`,
  alternates: { canonical: "/app" },
};

export default function AppPage() {
  const ld = graph(
    organization,
    {
      "@type": "SoftwareApplication",
      name: "Recharge app",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: `The app Recharge uses to run serviced accommodation, with ${toolCount} tools across owners, guests, cleaning, maintenance and accounts.`,
      featureList: teams.flatMap((t) => t.tools.map((tool) => `${tool.name}: ${tool.does}`)),
      provider: { "@id": abs("/#organization") },
    },
    breadcrumbs([{ name: "The app", path: "/app" }]),
  );

  return (
    <>
      <JsonLd data={ld} />
      <PageHero eyebrow="The Recharge app" title="One app runs every home" lead={`Owners, guest support, cleaners, maintenance and accounts all work from the same app. ${toolCount} tools, and every job has an owner, a status and a record.`}>
        <div className="hero-actions">
          <a className="btn btn-mint" href="#tools">See every tool <ArrowRight size={18} /></a>
          <Link className="btn btn-line-light" href="/owners#estimate">Get your free estimate</Link>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Who uses it</p>
            <h2 className="h2">Each person sees what they need</h2>
            <p className="lead">For the homes they look after, and nothing else.</p>
          </Reveal>
          <AppShowcase />
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2">One booking, start to finish</h2>
            <p className="lead">Follow a single stay through the app. Each step is handled by a tool, and nothing depends on someone remembering.</p>
          </Reveal>
          <Journey />
        </div>
      </section>

      <section className="section paper" id="tools" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Every tool</p>
            <h2 className="h2">{toolCount} tools across five teams</h2>
            <p className="lead">This is the software behind every Recharge home. Choose a team to see what it uses.</p>
          </Reveal>
          <ToolsShowcase />
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Watch</p>
            <h2 className="h2">Why Recharge is different</h2>
          </Reveal>
          <Reveal><DiffVideo /></Reveal>
          <div className="diff-grid">
            {[
              ["Owners", "Live bookings, statements and approvals on your phone."],
              ["Guests", "Messages answered quickly, at any hour."],
              ["Cleaners", "Schedules, checklists and photo proof for every clean."],
              ["Maintenance", "Repairs logged, assigned and tracked to the finish."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="diff">
                <span className="num">0{i + 1}</span>
                <strong className="h3" style={{ fontSize: 20 }}>{t}</strong>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FaqSection items={appFaqs} title="About the app" eyebrow="Questions" />

      <section className="section paper">
        <div className="wrap">
          <h2 className="h3" style={{ marginBottom: 16 }}>Where to next</h2>
          <div className="next-links">
            <Link href="/owners"><strong>For owners <ArrowRight size={16} /></strong><span>Guaranteed rent or full management.</span></Link>
            <Link href="/support"><strong>24/7 support <ArrowRight size={16} /></strong><span>How the team behind the app helps.</span></Link>
            <Link href="/properties"><strong>Our homes <ArrowRight size={16} /></strong><span>See the homes the app runs.</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
