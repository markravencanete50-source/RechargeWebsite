import { ArrowUpRight, Bath, BedDouble, Bus, Clock, DoorOpen, Landmark, MapPin, Phone, Pill, Plane, ShoppingCart, TrainFront, Trees, Users, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmenityIcon } from "@/components/Amenity";
import { Gallery } from "@/components/Gallery";
import { HomeCard } from "@/components/HomeCard";
import { Reveal } from "@/components/Reveal";
import { distance, homeBySlug, homes, money } from "@/content/properties";
import { site } from "@/content/site";

const NEARBY_ICON: Record<string, LucideIcon> = { station: TrainFront, bus: Bus, supermarket: ShoppingCart, pharmacy: Pill, restaurant: UtensilsCrossed, park: Trees, attraction: Landmark, airport: Plane };

export function generateStaticParams() {
  return homes.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const home = homeBySlug((await params).slug);
  if (!home) return {};
  const description = home.description?.split("\n")[0].slice(0, 155) || `Book ${home.title} in ${home.town} direct with Recharge.`;
  return { title: `${home.title}, ${home.town}`, description, alternates: { canonical: `/properties/${home.slug}` }, openGraph: home.photos[0]?.src ? { images: [home.photos[0].src] } : undefined };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const home = homeBySlug((await params).slug);
  if (!home) notFound();
  const paragraphs = (home.description ?? "").split(/\n{2,}|\n(?=[A-Z])/).map((p) => p.trim()).filter(Boolean);
  const others = homes.filter((h) => h.slug !== home.slug && h.region === home.region).slice(0, 4);
  const facts = [
    home.guests && { icon: Users, text: `Sleeps ${home.guests}` },
    { icon: BedDouble, text: `${home.bedrooms} bedroom${home.bedrooms === 1 ? "" : "s"}${home.beds ? `, ${home.beds} bed${home.beds === 1 ? "" : "s"}` : ""}` },
    home.bathrooms && { icon: Bath, text: `${home.bathrooms} bathroom${home.bathrooms === 1 ? "" : "s"}` },
  ].filter(Boolean) as { icon: LucideIcon; text: string }[];

  return (
    <>
      <section className="section prop-section">
        <div className="wrap">
          <p className="crumbs"><Link href="/properties">Properties</Link> / <Link href={`/properties?area=${encodeURIComponent(home.region)}`}>{home.region}</Link></p>
          <h1 className="h2 prop-title">{home.title}</h1>
          <p className="prop-place"><MapPin size={17} /> {home.town}, {home.region} {home.district}{home.reviews > 0 && <span> · {home.reviews} guest reviews</span>}</p>
          <Gallery photos={home.photos} title={home.title} />
          <div className="prop">
            <div className="prop-main">
              <ul className="prop-facts">{facts.map((f) => <li key={f.text}><f.icon size={20} /> {f.text}</li>)}</ul>

              {paragraphs.length > 0 && (
                <Reveal className="prop-block">
                  <h2 className="h3">About this home</h2>
                  {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </Reveal>
              )}

              {home.amenities.length > 0 && (
                <Reveal className="prop-block">
                  <h2 className="h3">What this home offers</h2>
                  <ul className="amenities">{home.amenities.map((a) => <li key={a}><AmenityIcon name={a} /> {a}</li>)}</ul>
                </Reveal>
              )}

              {home.nearby && home.nearby.length > 0 && (
                <Reveal className="prop-block">
                  <h2 className="h3">What is nearby</h2>
                  <ul className="nearby">
                    {home.nearby.map((n) => {
                      const Icon = NEARBY_ICON[n.kind] ?? MapPin;
                      return <li key={n.kind}><span className="ic"><Icon size={20} /></span><div><strong>{n.name || n.label}</strong><span>{n.name ? `${n.label}, ` : ""}{distance(n.metres)}</span></div></li>;
                    })}
                  </ul>
                  <p className="fine">Straight-line distances, from OpenStreetMap.</p>
                </Reveal>
              )}

              {(home.checkIn || home.checkOut || home.houseRules) && (
                <Reveal className="prop-block">
                  <h2 className="h3">Good to know</h2>
                  <ul className="prop-facts">
                    {home.checkIn && <li><DoorOpen size={20} /> Check in from {home.checkIn}</li>}
                    {home.checkOut && <li><Clock size={20} /> Check out by {home.checkOut}</li>}
                  </ul>
                  {home.houseRules && <p className="muted" style={{ whiteSpace: "pre-line" }}>{home.houseRules}</p>}
                </Reveal>
              )}
            </div>
            <aside className="book-card" aria-label="Book this home">
              {home.price !== undefined && <p className="book-price">Around <strong>{money(home.price, home.currency)}</strong> a night<span>Rates change by date. Your exact total shows when you choose dates.</span></p>}
              <strong className="h3">Book direct and save {site.directDiscount}</strong>
              <ul className="facts">
                {facts.map((f) => <li key={f.text}><f.icon size={18} /> {f.text}</li>)}
                <li><Clock size={18} /> Support 24/7 during your stay</li>
              </ul>
              <a className="btn btn-primary" href={home.bookingUrl ?? site.bookingUrl} target="_blank" rel="noopener">Check dates and book <ArrowUpRight size={18} /></a>
              <a className="btn btn-ghost" href={site.phone.href}><Phone size={18} /> {site.phone.display}</a>
              {home.licence && <p className="licence">Short-term let licence: {home.licence}</p>}
            </aside>
          </div>
        </div>
      </section>
      {others.length > 0 && (
        <section className="section paper">
          <div className="wrap">
            <div className="section-link">
              <h2 className="h2" style={{ fontSize: "clamp(28px,3vw,40px)" }}>More homes in {home.region}</h2>
              <Link className="text-link" href={`/properties?area=${encodeURIComponent(home.region)}`}>See all <ArrowUpRight size={16} /></Link>
            </div>
            <div className="homes">{others.map((h) => <HomeCard key={h.slug} home={h} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
