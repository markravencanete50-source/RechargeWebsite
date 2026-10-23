import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { HomeCard } from "@/components/HomeCard";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { packShot, showcase, type Shot } from "@/content/showcase";
import { trips } from "@/content/stay";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/stay/trips";

// A photo beside each kind of trip. Stock photos illustrate the trip; the homes below are the real ones.
const photos: Record<string, { shot: Shot; tall: boolean }> = {
  families: { shot: packShot("S04"), tall: false },
  contractors: { shot: packShot("R08"), tall: false },
  business: { shot: packShot("S06"), tall: true },
  "long-stays": { shot: packShot("R03"), tall: false },
};

export const metadata: Metadata = {
  title: "Homes for families, contractors, work trips and long stays",
  description: "Serviced homes in Scotland for families and groups, contractors and crews, business travel and longer stays. See the homes that suit each trip.",
  alternates: { canonical: path },
};

export default async function TripsPage() {
  const { homes } = await getCatalog();
  const list = trips(homes);
  const faqs = [
    { q: "What is the biggest home you have?", a: `Our largest homes sleep ${Math.max(...homes.map((h) => h.guests ?? 0))}. Set the number of guests in the search to see every home that fits your group.` },
    { q: "Can contractors book for several weeks?", a: "Yes. Most of our homes allow long stays, and many offer a long-stay discount on request. Tell us your dates and how many are in the crew." },
    { q: "Are your homes suitable for children?", a: "Most of them are. Each home lists the beds in every room, so you can check the layout before you book." },
    { q: "Can I stay while my own home is being repaired?", a: "Yes. Many guests stay with us during a renovation, a move or an insurance claim. Call us with your dates and we will find a home that fits." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Stays", path: "/stay" }, { name: "Trips we suit", path }]))} />
      <PageHero photo={showcase.families} eyebrow="Stays" title="Trips we suit" lead="A whole home works for more kinds of trip than a hotel room. These are the guests who stay with us most, and the homes that suit them best." />
      <SubNav section="/stay" current={path} />
      <nav className="jump" aria-label="Trips on this page">
        <div className="wrap">{list.map((t) => <a key={t.id} href={`#${t.id}`}>{t.title}<span>{t.count}</span></a>)}</div>
      </nav>

      {list.map((t, i) => (
        <section key={t.id} id={t.id} className={`section trip-block${i % 2 ? " paper" : ""}`} style={{ scrollMarginTop: 80 }}>
          <div className="wrap">
            <div className="spec trip-intro">
              {photos[t.id] && (
                <Reveal className={`spec-media${photos[t.id].tall ? " tall" : ""}`}>
                  <Image src={photos[t.id].shot.src} alt={photos[t.id].shot.alt ?? ""} fill sizes="(max-width: 900px) 100vw, 45vw" />
                </Reveal>
              )}
              <div className="spec-body">
                <Reveal>
                  <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="h2">{t.title}</h2>
                  <p className="lead" style={{ marginTop: 16 }}>{t.lead}</p>
                </Reveal>
                <Reveal delay={0.08}>
                  <ul className="trip-points">{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <Link className="text-link" href={t.href}>{t.cta} <ArrowRight size={16} /></Link>
                </Reveal>
              </div>
            </div>
            {t.homes.length > 0 && <div className="homes">{t.homes.map((h) => <Reveal key={h.slug}><HomeCard home={h} /></Reveal>)}</div>}
          </div>
        </section>
      ))}

      <FaqSection items={faqs} title="Planning your trip" eyebrow="Questions" />
    </>
  );
}
