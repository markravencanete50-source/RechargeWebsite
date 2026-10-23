import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { regionSlug } from "@/content/home-utils";
import { showcase } from "@/content/showcase";
import { abs, breadcrumbs, graph } from "@/lib/schema";

const path = "/about/where-we-work";

export async function generateMetadata(): Promise<Metadata> {
  const { regions } = await getCatalog();
  return {
    title: "Where we work in Scotland",
    description: `Recharge runs homes in ${regions.length} areas of Scotland, including ${regions.slice(0, 5).map((r) => r.name).join(", ")}. See every area and town.`,
    alternates: { canonical: path },
  };
}

export default async function WhereWeWorkPage() {
  const { homes, regions, towns } = await getCatalog();
  const ld = graph(
    { "@type": "ItemList", name: "Areas Recharge covers", itemListElement: regions.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: `${r.name}, Scotland`, url: abs(`/properties/area/${regionSlug(r.name)}`) })) },
    breadcrumbs([{ name: "About", path: "/about" }, { name: "Where we work", path }]),
  );
  return (
    <>
      <JsonLd data={ld} />
      <PageHero photo={showcase.homeHero[1]} eyebrow="About" title="Where we work" lead={`We run ${homes.length} homes in ${regions.length} areas of Scotland. Every area and town is listed below, with the number of homes in each.`} />
      <SubNav section="/about" current={path} />

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes we run"], [String(regions.length), "areas of Scotland"], [String(towns.length), "towns and cities"], ["24/7", "support in every area"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="region-list">
            {regions.map((r, i) => {
              const inArea = towns.filter((t) => t.region === r.name).sort((a, b) => b.count - a.count);
              return (
                <Reveal key={r.name} delay={0.03 * (i % 6)} className="region-row">
                  <h2><Link href={`/properties/area/${regionSlug(r.name)}`}>{r.name}</Link></h2>
                  <p className="region-count"><strong>{r.count}</strong> {r.count === 1 ? "home" : "homes"}</p>
                  <p className="region-towns">{inArea.map((t) => `${t.name}${t.count > 1 ? ` (${t.count})` : ""}`).join(" · ")}</p>
                  <Link className="text-link" href={`/properties/area/${regionSlug(r.name)}`}>See homes <ArrowRight size={16} /></Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="note-line" style={{ marginTop: 0 }}>
            <p><strong>Own a property somewhere else in Scotland?</strong> Send us the details and we will tell you if we can help.</p>
            <Link className="text-link" href="/owners#estimate">Get your free estimate <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
