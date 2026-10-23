import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { OwnerPortal } from "@/components/OwnerPortal";
import { PageHero } from "@/components/PageHero";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SubNav } from "@/components/SubNav";
import { appPage, appPages, stepsOf, teamOf } from "@/content/app-pages";
import { packShot } from "@/content/showcase";
import { site } from "@/content/site";
import { breadcrumbs, graph } from "@/lib/schema";

export function generateStaticParams() {
  return appPages.map((p) => ({ team: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ team: string }> }): Promise<Metadata> {
  const p = appPage((await params).team);
  if (!p) return {};
  const t = teamOf(p);
  return {
    title: `${p.title}: the Recharge app`,
    description: `${p.lead} ${t.tools.length} tools: ${t.tools.slice(0, 4).map((x) => x.name.toLowerCase()).join(", ")} and more.`,
    alternates: { canonical: `/app/${p.slug}` },
  };
}

export default async function AppTeamPage({ params }: { params: Promise<{ team: string }> }) {
  const p = appPage((await params).team);
  if (!p) notFound();
  const t = teamOf(p);
  const path = `/app/${p.slug}`;
  const steps = stepsOf(p);
  const i = appPages.indexOf(p);
  const next = appPages[(i + 1) % appPages.length];
  const photo = p.photo ? { shot: packShot(p.photo), tall: p.photo === "S01" } : null;
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "The app", path: "/app" }, { name: p.title, path }]))} />
      <PageHero eyebrow={`The app · ${t.brand}`} title={p.title} lead={p.lead} />
      <SubNav section="/app" current={path} />

      <section className="section">
        <div className={`wrap ${p.screen ? "media-split app-team" : "split-sticky"}`}>
          {p.screen ? (
            <Reveal className="support-phone"><PhoneFrame src={p.screen} alt={p.screenAlt ?? ""} /></Reveal>
          ) : (
            <Reveal className="split-head">
              <p className="eyebrow">{t.tools.length} tools</p>
              <h2 className="h2">What the {t.name.toLowerCase()} team uses</h2>
              <p className="lead">{t.lead}</p>
            </Reveal>
          )}
          <div>
            {p.screen && (
              <Reveal className="section-head" >
                <p className="eyebrow">{t.tools.length} tools</p>
                <h2 className="h2">What it does</h2>
                <p className="lead">{t.lead}</p>
              </Reveal>
            )}
            <RowList items={t.tools.map((x) => ({ title: x.name, text: <>{x.does} <em className="tool-who">{x.for}</em></> }))} />
          </div>
        </div>
      </section>

      {p.team === "owners" && (
        <section className="section paper">
          <div className="wrap">
            <div className="head-row">
              <Reveal><p className="eyebrow">Your client portal</p><h2 className="h2">See everything. Approve from your phone.</h2></Reveal>
              <Reveal delay={0.08}><p className="lead">Every owner gets their own login to the Recharge client portal. This is what you see in it.</p></Reveal>
            </div>
            <OwnerPortal />
            <p className="portal-login">Already an owner with us? <a className="btn btn-primary" href={site.ownerLogin}>Owner login</a></p>
          </div>
        </section>
      )}

      <section className={`section${p.team === "owners" ? "" : " paper"}`}>
        <div className={`wrap ${photo ? "spec" : "split-sticky"}`}>
          {photo && (
            <Reveal className={`spec-media${photo.tall ? " tall" : ""}`}>
              <Image src={photo.shot.src} alt={photo.shot.alt ?? ""} fill sizes="(max-width: 900px) 100vw, 45vw" />
            </Reveal>
          )}
          <div className={photo ? "spec-body" : "split-sticky-pair"}>
            <Reveal className={photo ? undefined : "split-head"}>
              <p className="eyebrow">Who uses it</p>
              <h2 className="h2">Each person sees what they need</h2>
              <p className="lead" style={{ marginTop: 16 }}>For the homes and jobs they look after, and nothing else.</p>
            </Reveal>
            <ul className="trip-points">{p.who.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="section dark on-dark">
          <div className="wrap">
            <div className="head-row">
              <Reveal><p className="eyebrow">Where it fits</p><h2 className="h2">Its part in one booking</h2></Reveal>
              <Reveal delay={0.08}><Link className="text-link" href="/app/how-it-works">See the whole journey <ArrowRight size={16} /></Link></Reveal>
            </div>
            <ol className="fit-steps">
              {steps.map((s) => (
                <Reveal as="li" key={s.title}>
                  <span>{String(s.n).padStart(2, "0")}</span>
                  <strong>{s.title}</strong>
                  <p>{s.text}</p>
                  <em>Tool: {s.tool}</em>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      <FaqSection items={p.faqs} title={`${p.title}: questions`} eyebrow="Questions" />

      <section className="section paper">
        <div className="wrap">
          <ul className="child-index">
            {p.links.map((l) => <li key={l.href}><Link href={l.href}><strong>{l.label}</strong><span>{l.text}</span><em aria-hidden>→</em></Link></li>)}
            <li><Link href={`/app/${next.slug}`}><strong>Next: {next.title}</strong><span>{next.lead}</span><em aria-hidden>→</em></Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}
