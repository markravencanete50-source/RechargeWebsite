import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { SubNav } from "@/components/SubNav";
import { guestGroups } from "@/content/about";
import { getCatalog } from "@/content/catalog";
import { showcase } from "@/content/showcase";
import { trips } from "@/content/stay";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/about/who-stays";

export const metadata: Metadata = {
  title: "Who stays with us",
  description: "People travelling for work, families on holiday, and people between homes. Who stays in Recharge homes across Scotland, and why a whole home suits them.",
  alternates: { canonical: path },
};

export default async function WhoStaysPage() {
  const { homes, regions, reviewTotal } = await getCatalog();
  const byId = Object.fromEntries(trips(homes).map((t) => [t.id, t]));
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "About", path: "/about" }, { name: "Who stays with us", path }]))} />
      <PageHero photo={showcase.guests} eyebrow="About" title="Who stays with us" lead="Our guests have a reason to be here: work, a break, or a change in life that moved them for a while. A whole home suits all three." />
      <SubNav section="/about" current={path} />

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes to stay in"], [String(regions.length), "areas of Scotland"], [reviewTotal.toLocaleString("en-GB"), "reviews from past guests"], ["24/7", "help from a real person"]]} />
        </div>
      </section>

      {guestGroups.map((g, i) => {
        const t = byId[g.trip];
        return (
          <section key={g.id} className={`section${i % 2 ? "" : " paper"}`}>
            <div className="wrap spec">
              <Reveal className="spec-media">{g.shot && <Image src={g.shot.src} alt={g.shot.caption} fill sizes="(max-width: 900px) 100vw, 45vw" />}</Reveal>
              <div className="spec-body">
                <Reveal>
                  <p className="eyebrow">{g.label}</p>
                  <h2 className="h2">{g.title}</h2>
                  <p className="lead">{g.text}</p>
                </Reveal>
                {t && (
                  <Reveal delay={0.08}>
                    <ul className="trip-points">{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    <Link className="text-link" href={`/stay/trips#${t.id}`}>Homes that suit <ArrowRight size={16} /></Link>
                  </Reveal>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <section className="section">
        <div className="wrap">
          <div className="note-line">
            <p><strong>Travelling with a crew, or a group of ten?</strong> See every kind of trip our homes suit, with the homes that fit each one.</p>
            <Link className="text-link" href="/stay/trips">Trips we suit <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
