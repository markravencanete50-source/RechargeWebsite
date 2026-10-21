import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/FaqList";
import { HomeCard } from "@/components/HomeCard";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import type { Faq } from "@/content/faqs";
import { parseListing } from "@/content/listing";
import { heading, homes, money, regionBySlug, regions, regionSlug } from "@/content/properties";
import { site } from "@/content/site";
import { abs, breadcrumbs, faqPage, graph, organization } from "@/lib/schema";

export function generateStaticParams() {
  return regions.map((r) => ({ region: regionSlug(r.name) }));
}

function areaData(slug: string) {
  const region = regionBySlug(slug);
  if (!region) return null;
  const list = homes.filter((h) => h.region === region.name).sort((a, b) => Number(!!b.photos[0]?.src) - Number(!!a.photos[0]?.src) || b.reviews - a.reviews);
  const towns = [...new Set(list.map((h) => h.town))];
  const prices = list.map((h) => h.price).filter((p): p is number => typeof p === "number").sort((a, b) => a - b);
  const beds = list.map((h) => h.bedrooms);
  const guests = Math.max(0, ...list.map((h) => h.guests ?? 0));
  const longStay = list.filter((h) => parseListing(h.description, h.houseRules).longStay).length;
  return { region, list, towns, prices, minBeds: Math.min(...beds), maxBeds: Math.max(...beds), guests, longStay };
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export async function generateMetadata({ params }: PageProps<"/properties/area/[region]">): Promise<Metadata> {
  const d = areaData((await params).region);
  if (!d) return {};
  const title = `Serviced accommodation in ${d.region.name}`;
  const description = `${plural(d.list.length, "Recharge home")} in ${d.towns.slice(0, 4).join(", ")}${d.prices.length ? `, from around ${money(d.prices[0])} a night` : ""}. Book direct and save ${site.directDiscount}, with 24/7 support.`;
  return { title, description, alternates: { canonical: `/properties/area/${regionSlug(d.region.name)}` }, openGraph: { title, description } };
}

export default async function AreaPage({ params }: PageProps<"/properties/area/[region]">) {
  const d = areaData((await params).region);
  if (!d) notFound();
  const name = d.region.name;
  const path = `/properties/area/${regionSlug(name)}`;
  const faqs: Faq[] = [
    { q: `How many Recharge homes are there in ${name}?`, a: `${plural(d.list.length, "home")}, in ${d.towns.join(", ")}. They range from ${d.minBeds === 0 ? "studios" : plural(d.minBeds, "bedroom")} to ${plural(d.maxBeds, "bedroom")}${d.guests ? `, and the largest sleeps ${d.guests}` : ""}.` },
    ...(d.prices.length ? [{ q: `How much does a night cost in ${name}?`, a: `Nightly rates start at around ${money(d.prices[0])} and go up to around ${money(d.prices[d.prices.length - 1])}, depending on the home and the dates. Booking direct saves ${site.directDiscount}.` }] : []),
    ...(d.longStay ? [{ q: `Can I book a long stay in ${name}?`, a: `Yes. ${plural(d.longStay, "home")} here offer long-stay discounts on request, which suits contractors, relocations and insurance stays. Call ${site.phone.display} with your dates.` }] : []),
    { q: "What is included in every stay?", a: "A professionally cleaned home, fresh linen and towels, a stocked kitchen and 24/7 support from the Recharge team during your stay." },
  ];
  const ld = graph(
    organization,
    { "@type": "ItemList", name: `Recharge homes in ${name}`, numberOfItems: d.list.length, itemListElement: d.list.map((h, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/properties/${h.slug}`), name: heading(h) })) },
    breadcrumbs([{ name: "Properties", path: "/properties" }, { name, path }]),
    faqPage(faqs),
  );

  return (
    <>
      <JsonLd data={ld} />
      <PageHero eyebrow={`Properties in ${name}`} title={`Places to stay in ${name}`} lead={`${plural(d.list.length, "serviced home")} in ${d.towns.slice(0, 5).join(", ")}${d.towns.length > 5 ? " and more" : ""}. Book direct with Recharge and save ${site.directDiscount}.`} />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div className="stat-row">
            <div><strong>{d.list.length}</strong><span>homes</span></div>
            <div><strong>{d.towns.length}</strong><span>{d.towns.length === 1 ? "town" : "towns"}</span></div>
            {d.prices.length > 0 && <div><strong>{money(d.prices[0])}</strong><span>from, a night</span></div>}
            {d.guests > 0 && <div><strong>{d.guests}</strong><span>guests in the largest home</span></div>}
          </div>
          <div className="homes" style={{ marginTop: 32 }}>
            {d.list.map((h, i) => <Reveal key={h.slug} delay={(i % 4) * 0.05}><HomeCard home={h} /></Reveal>)}
          </div>
          <p style={{ marginTop: 28 }}><Link className="text-link" href={`/properties?area=${encodeURIComponent(name)}`}>Search {name} by dates and guests <ArrowRight size={16} /></Link></p>
        </div>
      </section>
      <section className="section paper">
        <div className="wrap faq-grid">
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 className="h2">Staying in {name}</h2>
            <p className="lead">Short answers about our homes here. For everything else, see <Link href="/stay">how stays work</Link> or the <Link href="/faq">full FAQ</Link>.</p>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="h3" style={{ marginBottom: 16 }}>Other areas</h2>
          <div className="link-cloud">
            {regions.filter((r) => r.name !== name).map((r) => <Link key={r.name} href={`/properties/area/${regionSlug(r.name)}`}>{r.name} <span>{r.count}</span></Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
