import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { money, regionSlug } from "@/content/home-utils";
import { areaCovers, regionPhotos, showcase } from "@/content/showcase";
import { abs, breadcrumbs, graph } from "@/lib/schema";

const path = "/properties/areas";

export async function generateMetadata(): Promise<Metadata> {
  const { regions, homes } = await getCatalog();
  return {
    title: "Serviced homes by area in Scotland",
    description: `${homes.length} serviced homes in ${regions.length} areas of Scotland, including ${regions.slice(0, 5).map((r) => r.name).join(", ")}. Browse by area and book direct.`,
    alternates: { canonical: path },
  };
}

// A photo of the place itself where the image pack has one, then a chosen room, then the area's best-reviewed home.
function pickCover(name: string) {
  const s = regionPhotos[name] ?? areaCovers[name];
  return s ? { src: s.src, alt: s.alt ?? s.caption } : undefined;
}

export default async function AreasPage() {
  const { homes, regions, towns } = await getCatalog();
  const rows = regions.map((r) => {
    const inArea = homes.filter((h) => h.region === r.name).sort((a, b) => b.reviews - a.reviews);
    const prices = inArea.map((h) => h.price).filter((p): p is number => typeof p === "number").sort((a, b) => a - b);
    return {
      ...r, slug: regionSlug(r.name), cover: inArea.find((h) => h.photos[0]?.src),
      from: prices[0], towns: towns.filter((t) => t.region === r.name).sort((a, b) => b.count - a.count).map((t) => t.name),
    };
  });
  const ld = graph(
    { "@type": "ItemList", name: "Areas", itemListElement: rows.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.name, url: abs(`/properties/area/${r.slug}`) })) },
    breadcrumbs([{ name: "Properties", path: "/properties" }, { name: "Browse by area", path }]),
  );
  return (
    <>
      <JsonLd data={ld} />
      <PageHero photo={showcase.homeHero[0]} eyebrow="Properties" title="Browse by area" lead={`${homes.length} homes in ${regions.length} areas of Scotland. Choose an area to see every home in it.`} />
      <SubNav section="/properties" current={path} />

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes"], [String(regions.length), "areas"], [String(towns.length), "towns and cities"], ["24/7", "support in every area"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ul className="area-cards">
            {rows.map((r, i) => (
              <Reveal as="li" key={r.name} delay={(i % 3) * 0.06}>
                <Link href={`/properties/area/${r.slug}`}>
                  <span className="area-card-photo"><Photo photo={pickCover(r.name) ?? r.cover?.photos[0]} alt={`A Recharge home in ${r.name}`} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" priority={i < 3} /></span>
                  <strong>{r.name}</strong>
                  <span className="area-card-meta">{r.count} {r.count === 1 ? "home" : "homes"}{r.from ? ` · from ${money(r.from)} a night` : ""}</span>
                  <span className="area-card-towns">{r.towns.slice(0, 5).join(" · ")}{r.towns.length > 5 ? " and more" : ""}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="note-line" style={{ marginTop: 0 }}>
            <p><strong>Know your dates?</strong> Search every home by area, dates and guests.</p>
            <Link className="text-link" href="/properties">Search all homes <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
