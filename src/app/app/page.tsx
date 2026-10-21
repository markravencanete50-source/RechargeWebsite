import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShowcase } from "@/components/AppShowcase";
import { DiffVideo } from "@/components/DiffVideo";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { Journey } from "@/components/Journey";
import { AppHero } from "@/components/AppHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { ToolsShowcase } from "@/components/ToolsShowcase";
import { appFaqs } from "@/content/faqs";
import { homes } from "@/content/properties";
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
      <AppHero>
        <Reveal><p className="eyebrow">The Recharge app</p></Reveal>
        <Reveal delay={0.06}><h1 className="h1 page-title">One app runs every home</h1></Reveal>
        <Reveal delay={0.12}><p className="lead">Owners, guest support, cleaners, maintenance and accounts all work from the same app. Every job has an owner, a status and a record.</p></Reveal>
        <Reveal delay={0.18}>
          <div className="hero-actions">
            <a className="btn btn-mint" href="#journey">See how it works <ArrowRight size={18} /></a>
            <Link className="btn btn-line-light" href="/owners#portal">The owner portal</Link>
          </div>
        </Reveal>
      </AppHero>

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(toolCount), "tools in the app"], [String(teams.length), "teams working from it"], [String(homes.length), "homes it runs"], ["24/7", "support behind it"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Who uses it</p><h2 className="h2">Each person sees what they need</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">For the homes they look after, and nothing else.</p></Reveal>
          </div>
          <AppShowcase />
        </div>
      </section>

      <section className="section dark on-dark" id="journey" style={{ scrollMarginTop: 80 }}>
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2">One booking, start to finish</h2>
            <p className="lead">Follow a single stay through the app. Each step is handled by a tool, so nothing depends on someone remembering.</p>
          </Reveal>
          <Journey />
        </div>
      </section>

      <section className="section paper" id="tools" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Behind the scenes</p><h2 className="h2">{toolCount} tools across five teams</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">The tools our team uses behind every home. Owners see their own client portal, shown under For owners.</p></Reveal>
          </div>
          <ToolsShowcase />
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
