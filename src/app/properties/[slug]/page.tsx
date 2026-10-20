import { ArrowUpRight, Bath, BedDouble, Clock, MapPin, Phone, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeCard } from "@/components/HomeCard";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { homeBySlug, homes } from "@/content/photos";
import { site } from "@/content/site";

export function generateStaticParams() {
  return homes.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const home = homeBySlug((await params).slug);
  if (!home) return {};
  return { title: `${home.name}, ${home.area}`, description: `Book ${home.name} in ${home.area} direct with Recharge.`, alternates: { canonical: `/properties/${home.slug}` } };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const home = homeBySlug((await params).slug);
  if (!home) notFound();
  const photos = [0, 1, 2].map((i) => home.photos[i] ?? { src: null, alt: `${home.name}, photo ${i + 1}` });
  const others = homes.filter((h) => h.slug !== home.slug).slice(0, 4);

  return (
    <>
      <section className="section" style={{ paddingTop: "calc(76px + 40px)" }}>
        <div className="wrap">
          <Reveal>
            <p className="muted" style={{ margin: "0 0 8px", fontSize: 14 }}><Link href="/properties">Properties</Link> / {home.area}</p>
            <h1 className="h2" style={{ marginBottom: 10 }}>{home.name}</h1>
            <p className="home-area" style={{ fontSize: 16, margin: "0 0 28px" }}><MapPin size={17} /> {home.area}</p>
          </Reveal>
          <div className="prop">
            <div style={{ display: "grid", gap: 32 }}>
              <Reveal className="gallery">
                {photos.map((p, i) => <div key={i}><Photo photo={p} sizes={i === 0 ? "(max-width: 900px) 70vw, 45vw" : "25vw"} priority={i === 0} /></div>)}
              </Reveal>
              {home.summary && <p className="lead" style={{ maxWidth: "none" }}>{home.summary}</p>}
            </div>
            <aside className="book-card" aria-label="Book this home">
              <strong className="h3">Book {home.name}</strong>
              {(home.sleeps || home.bedrooms || home.bathrooms) && (
                <ul className="facts">
                  {home.sleeps && <li><Users size={18} /> Sleeps {home.sleeps}</li>}
                  {home.bedrooms && <li><BedDouble size={18} /> {home.bedrooms} bedroom{home.bedrooms > 1 ? "s" : ""}</li>}
                  {home.bathrooms && <li><Bath size={18} /> {home.bathrooms} bathroom{home.bathrooms > 1 ? "s" : ""}</li>}
                </ul>
              )}
              <ul className="facts">
                <li><Clock size={18} /> Support 24/7 during your stay</li>
              </ul>
              <a className="btn btn-primary" href={home.bookingUrl ?? site.bookingUrl} target="_blank" rel="noopener">Check dates and book <ArrowUpRight size={18} /></a>
              <a className="btn btn-ghost" href={site.phone.href}><Phone size={18} /> {site.phone.display}</a>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>Book direct and save {site.directDiscount}.</p>
              {home.licence && <p className="licence">Short-term let licence: {home.licence}</p>}
            </aside>
          </div>
        </div>
      </section>
      {others.length > 0 && (
        <section className="section paper">
          <div className="wrap">
            <h2 className="h2" style={{ marginBottom: 32, fontSize: "clamp(28px,3vw,40px)" }}>More homes</h2>
            <div className="homes">{others.map((h) => <HomeCard key={h.slug} home={h} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
