import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/FaqSection";
import { HomeCard } from "@/components/HomeCard";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { collection, collections } from "@/content/collections";
import { heading, money, regionSlug } from "@/content/home-utils";
import { abs, breadcrumbs, graph } from "@/lib/schema";

type Props = { params: Promise<{ collection: string }> };

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = collection((await params).collection);
  if (!c) return {};
  const { homes, direct } = await getCatalog();
  const n = homes.filter(c.test).length;
  return {
    title: `${c.title} in Scotland`,
    description: `${n} ${c.title.toLowerCase()} to book direct across Scotland. ${c.lead} Book direct and save ${direct}.`,
    alternates: { canonical: `/properties/collection/${c.slug}` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const c = collection((await params).collection);
  if (!c) notFound();
  const { homes } = await getCatalog();
  const path = `/properties/collection/${c.slug}`;
  const list = homes.filter(c.test).sort((a, b) => b.reviews - a.reviews);
  const prices = list.map((h) => h.price).filter((p): p is number => typeof p === "number").sort((a, b) => a - b);
  const byArea = new Map<string, number>();
  for (const h of list) byArea.set(h.region, (byArea.get(h.region) ?? 0) + 1);
  const areaRows = [...byArea].sort((a, b) => b[1] - a[1]);
  const cover = list.find((h) => h.photos[0]?.src);
  const shot = cover?.photos[0]?.src ? { src: cover.photos[0].src, href: `/properties/${cover.slug}`, caption: heading(cover) } : null;
  const ld = graph(
    { "@type": "ItemList", name: c.title, numberOfItems: list.length, itemListElement: list.map((h, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/properties/${h.slug}`), name: heading(h) })) },
    breadcrumbs([{ name: "Properties", path: "/properties" }, { name: c.title, path }]),
  );
  return (
    <>
      <JsonLd data={ld} />
      <PageHero photo={shot} eyebrow="Properties" title={c.title} lead={c.lead} />
      <SubNav section="/properties" current="/properties" />

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(list.length), list.length === 1 ? "home" : "homes"], [String(areaRows.length), areaRows.length === 1 ? "area" : "areas"], ...(prices.length ? [[money(prices[0]), "a night, from"] as [string, string], [money(prices[prices.length >> 1]), "a typical night"] as [string, string]] : [])]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="trip-head">
            <Reveal>
              <h2 className="h2">{list.length} {list.length === 1 ? "home" : "homes"}, best reviewed first</h2>
              <ul className="trip-points" style={{ marginTop: 18 }}>{c.intro.map((t) => <li key={t}>{t}</li>)}</ul>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="eyebrow">By area</p>
              <p className="area-line">{areaRows.map(([r, n], i) => <span key={r}>{i > 0 && " · "}<Link href={`/properties/area/${regionSlug(r)}`}>{r}</Link> {n}</span>)}</p>
              <Link className="text-link" href={c.search}>Search with dates and filters <ArrowRight size={16} /></Link>
            </Reveal>
          </div>
          <div className="homes">{list.map((h, i) => <Reveal key={h.slug} delay={(i % 4) * 0.05}><HomeCard home={h} priority={i < 4} /></Reveal>)}</div>
          {prices.length > 0 && <p className="gr-note">Prices are typical nightly rates. Your exact total shows when you choose dates.</p>}
        </div>
      </section>

      <FaqSection items={c.faqs(list)} title={`About ${c.title.toLowerCase()}`} eyebrow="Questions" tone="paper" />
    </>
  );
}
