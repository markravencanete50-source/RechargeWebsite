import { ArrowUpRight, Bath, BedDouble, Bus, Check, CigaretteOff, Clock, CookingPot, DoorOpen, House, IdCard, Info, Landmark, LogOut, MapPin, Package, Percent, Phone, Pill, Plane, ShoppingCart, Sofa, TrainFront, Trees, TriangleAlert, Users, UtensilsCrossed, VolumeX, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmenityIcon } from "@/components/Amenity";
import { FaqList } from "@/components/FaqList";
import { Gallery } from "@/components/Gallery";
import { HomeCard } from "@/components/HomeCard";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { homeFaqs } from "@/content/faqs";
import { groupAmenities, parseListing, type Room } from "@/content/listing";
import { distance, heading, homeBySlug, homes, money, regionSlug, tags } from "@/content/properties";
import { site } from "@/content/site";
import { abs, breadcrumbs, faqPage, graph, organization } from "@/lib/schema";

const NEARBY_ICON: Record<string, LucideIcon> = { station: TrainFront, bus: Bus, supermarket: ShoppingCart, pharmacy: Pill, restaurant: UtensilsCrossed, park: Trees, attraction: Landmark, airport: Plane };
const ROOM_ICON: Record<Room["kind"], LucideIcon> = { bedroom: BedDouble, living: Sofa, kitchen: CookingPot, bathroom: Bath, dining: UtensilsCrossed, other: Package };

function ruleIcon(rule: string): LucideIcon {
  if (/smok|vap/i.test(rule)) return CigaretteOff;
  if (/part|noise|music|quiet/i.test(rule)) return VolumeX;
  if (/damage|mess|charge/i.test(rule)) return TriangleAlert;
  if (/\bid\b|registration|verif|form/i.test(rule)) return IdCard;
  return Info;
}

export function generateStaticParams() {
  return homes.map((h) => ({ slug: h.slug }));
}

function summary(home: NonNullable<ReturnType<typeof homeBySlug>>) {
  const intro = parseListing(home.description, home.houseRules).intro.join(" ");
  const base = `${heading(home)}, ${home.region}. ${home.guests ? `Sleeps ${home.guests}. ` : ""}Book direct with Recharge and save ${site.directDiscount}.`;
  return (intro && intro.length > 60 ? intro.replace(/^Recharge Stays (is (proud|pleased) to present|proudly presents|presents)\s*/i, "").replace(/^./, (c) => c.toUpperCase()) : base).slice(0, 158);
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const home = homeBySlug((await params).slug);
  if (!home) return {};
  const title = `${heading(home)}, ${home.region}`;
  return {
    title,
    description: summary(home),
    alternates: { canonical: `/properties/${home.slug}` },
    openGraph: { title, description: summary(home), url: `/properties/${home.slug}`, images: home.photos[0]?.src ? [home.photos[0].src] : undefined },
  };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const home = homeBySlug((await params).slug);
  if (!home) notFound();
  const l = parseListing(home.description, home.houseRules);
  const sleeping = l.rooms.filter((r) => r.kind === "bedroom" || r.sleeps);
  const inside = l.rooms.filter((r) => !sleeping.includes(r));
  const amenityGroups = groupAmenities(home.amenities);
  const faqs = homeFaqs(home, l);
  const others = homes.filter((h) => h.slug !== home.slug && h.region === home.region).slice(0, 4);
  const facts = [
    home.guests && { icon: Users, text: `Sleeps ${home.guests}` },
    { icon: BedDouble, text: home.bedrooms === 0 ? "Studio" : `${home.bedrooms} bedroom${home.bedrooms === 1 ? "" : "s"}${home.beds ? `, ${home.beds} bed${home.beds === 1 ? "" : "s"}` : ""}` },
    home.bathrooms && { icon: Bath, text: `${home.bathrooms} bathroom${home.bathrooms === 1 ? "" : "s"}` },
  ].filter(Boolean) as { icon: LucideIcon; text: string }[];
  const sections = [
    { id: "overview", label: "Overview", show: l.intro.length > 0 || l.highlights.length > 0 },
    { id: "rooms", label: "Rooms", show: l.rooms.length > 0 },
    { id: "amenities", label: "Amenities", show: home.amenities.length > 0 },
    { id: "nearby", label: "Nearby", show: l.places.length > 0 || (home.nearby?.length ?? 0) > 0 },
    { id: "good-to-know", label: "Good to know", show: true },
    { id: "questions", label: "Questions", show: faqs.length > 0 },
  ].filter((s) => s.show);
  const labelled = (line: string) => {
    const m = line.match(/^([^:]{3,40}):\s+(.+)$/);
    return m ? <><b>{m[1]}:</b> {m[2]}</> : line;
  };
  const areaHref = `/properties/area/${regionSlug(home.region)}`;

  const ld = graph(
    organization,
    {
      "@type": "VacationRental",
      "@id": abs(`/properties/${home.slug}#home`),
      name: heading(home),
      description: summary(home),
      url: abs(`/properties/${home.slug}`),
      image: home.photos.slice(0, 6).map((p) => p.src),
      address: { "@type": "PostalAddress", addressLocality: home.town, addressRegion: home.region, addressCountry: "GB" },
      containsPlace: {
        "@type": "Accommodation",
        additionalType: home.bedrooms === 0 ? "Studio" : "EntirePlace",
        occupancy: home.guests ? { "@type": "QuantitativeValue", maxValue: home.guests } : undefined,
        numberOfBedrooms: home.bedrooms,
        numberOfBathroomsTotal: home.bathrooms,
        amenityFeature: home.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
      },
      checkinTime: home.checkIn,
      checkoutTime: home.checkOut,
      brand: { "@id": abs("/#organization") },
    },
    breadcrumbs([{ name: "Properties", path: "/properties" }, { name: home.region, path: areaHref }, { name: heading(home), path: `/properties/${home.slug}` }]),
    faqPage(faqs),
  );

  return (
    <>
      <JsonLd data={ld} />
      <section className="section prop-section">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/properties">Properties</Link> / <Link href={areaHref}>{home.region}</Link> / <span>{home.town}</span></nav>
          <h1 className="h2 prop-title">{heading(home)}</h1>
          <p className="prop-place"><MapPin size={17} /> {home.town}, {home.region} {home.district}{home.reviews > 0 && <span> · {home.reviews} guest reviews</span>}</p>
          {(tags(home).length > 0 || l.longStay) && (
            <div className="home-tags prop-tags">
              {l.longStay && <span className="tag-strong"><Percent size={13} /> Long-stay discounts</span>}
              {tags(home).map((t) => <span key={t}>{t}</span>)}
            </div>
          )}
          <Gallery photos={home.photos} title={heading(home)} />

          <nav className="prop-nav" aria-label="On this page">
            {sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}
          </nav>

          <div className="prop">
            <div className="prop-main">
              <ul className="prop-facts">{facts.map((f) => <li key={f.text}><f.icon size={20} /> {f.text}</li>)}</ul>

              {(l.intro.length > 0 || l.highlights.length > 0) && (
                <Reveal className="prop-block" id="overview">
                  <h2 className="h3">About this home</h2>
                  {l.intro.map((p, i) => <p key={i}>{p}</p>)}
                  {l.highlights.length > 0 && (
                    <ul className="checks">{l.highlights.map((h) => <li key={h}><Check size={18} /> {h}</li>)}</ul>
                  )}
                </Reveal>
              )}

              {l.rooms.length > 0 && (
                <Reveal className="prop-block" id="rooms">
                  {sleeping.length > 0 && (
                    <>
                      <h2 className="h3">Where you will sleep</h2>
                      <div className={`rooms${sleeping.some((r) => r.items.some((it) => it.length > 70)) ? " rooms-wide" : ""}`}>
                        {sleeping.map((r) => {
                          const Icon = ROOM_ICON[r.kind];
                          return (
                            <div className="room" key={r.name}>
                              <span className="ic"><Icon size={22} /></span>
                              <strong>{r.name}</strong>
                              <ul className={r.items.some((it) => it.length > 70) ? "prose" : undefined}>{r.items.map((it) => <li key={it}>{labelled(it.replace(/\s*\(sleeps \d+\)/i, ""))}</li>)}</ul>
                              {r.sleeps && <span className="room-sleeps"><Users size={14} /> Sleeps {r.sleeps}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {inside.length > 0 && (
                    <>
                      <h2 className="h3" style={{ marginTop: sleeping.length ? 18 : 0 }}>Inside the home</h2>
                      <div className="rooms rooms-wide">
                        {inside.map((r) => {
                          const Icon = ROOM_ICON[r.kind];
                          return (
                            <div className="room" key={r.name}>
                              <span className="ic"><Icon size={22} /></span>
                              <strong>{r.name}</strong>
                              <ul className={r.items.some((it) => it.length > 70) ? "prose" : undefined}>{r.items.map((it) => <li key={it}>{labelled(it)}</li>)}</ul>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </Reveal>
              )}

              {l.extra.map((e) => (
                <Reveal className="prop-block" key={e.title}>
                  <h2 className="h3">{e.title}</h2>
                  {e.lines.map((p, i) => <p key={i}>{labelled(p)}</p>)}
                </Reveal>
              ))}

              {amenityGroups.length > 0 && (
                <Reveal className="prop-block" id="amenities">
                  <h2 className="h3">What this home offers <span className="count">{home.amenities.length}</span></h2>
                  <div className="amenity-groups">
                    {amenityGroups.map((g) => (
                      <div key={g.name}>
                        <h3>{g.name}</h3>
                        <ul className="amenities">{g.items.map((a) => <li key={a}><AmenityIcon name={a} /> {a}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {(l.places.length > 0 || (home.nearby?.length ?? 0) > 0) && (
                <Reveal className="prop-block" id="nearby">
                  <h2 className="h3">What is nearby</h2>
                  {l.places.length > 0 && (
                    <ul className="places">
                      {l.places.map((p) => (
                        <li key={p.name + p.time}>
                          <span className="ic"><MapPin size={18} /></span>
                          <div><strong>{p.name}</strong>{p.note && <span>{p.note}</span>}</div>
                          {p.time && <em><Clock size={14} /> {p.time}</em>}
                        </li>
                      ))}
                    </ul>
                  )}
                  {l.placeNotes.map((n) => <p key={n}>{labelled(n)}</p>)}
                  {l.places.some((p) => p.time) && <p className="fine">Travel times are approximate and given by the host.</p>}
                  {home.nearby && home.nearby.length > 0 && (
                    <>
                      <ul className="nearby">
                        {home.nearby.map((n) => {
                          const Icon = NEARBY_ICON[n.kind] ?? MapPin;
                          return <li key={n.kind}><span className="ic"><Icon size={20} /></span><div><strong>{n.name || n.label}</strong><span>{n.name ? `${n.label}, ` : ""}{distance(n.metres)}</span></div></li>;
                        })}
                      </ul>
                      <p className="fine">Straight-line distances, from OpenStreetMap.</p>
                    </>
                  )}
                </Reveal>
              )}

              <Reveal className="prop-block" id="good-to-know">
                <h2 className="h3">Good to know</h2>
                <div className="times">
                  {home.checkIn && <div><DoorOpen size={22} /><span>Check in</span><strong>From {home.checkIn}</strong></div>}
                  {home.checkOut && <div><LogOut size={22} /><span>Check out</span><strong>By {home.checkOut}</strong></div>}
                  <div><Phone size={22} /><span>Support</span><strong>24/7 during your stay</strong></div>
                </div>
                {(l.details.length > 0 || l.included.length > 0) && (
                  <ul className="checks">
                    {l.details.map((d) => <li key={d.text}><House size={18} /> <span>{d.label && <b>{d.label}: </b>}{d.text}</span></li>)}
                    {l.included.map((d) => <li key={d}><Check size={18} /> {d}</li>)}
                  </ul>
                )}
                {l.rules.length > 0 && (
                  <>
                    <h3 className="sub">House rules</h3>
                    <ul className="rules">
                      {l.rules.map((r) => {
                        const Icon = ruleIcon(r);
                        return <li key={r}><Icon size={18} /> {r}</li>;
                      })}
                    </ul>
                  </>
                )}
              </Reveal>

              {faqs.length > 0 && (
                <Reveal className="prop-block" id="questions">
                  <h2 className="h3">Questions about this home</h2>
                  <FaqList items={faqs} />
                  <p className="fine">More answers on our <Link href="/faq">FAQ page</Link>, or see <Link href="/stay">how staying with Recharge works</Link>.</p>
                </Reveal>
              )}
            </div>
            <aside className="book-card" aria-label="Book this home">
              {home.price !== undefined && <p className="book-price">Around <strong>{money(home.price, home.currency)}</strong> a night<span>Rates change by date. Your exact total shows when you choose dates.</span></p>}
              <strong className="h3">Book direct and save {site.directDiscount}</strong>
              <ul className="facts">
                {facts.map((f) => <li key={f.text}><f.icon size={18} /> {f.text}</li>)}
                {home.checkIn && <li><DoorOpen size={18} /> Check in from {home.checkIn}</li>}
                <li><Clock size={18} /> Support 24/7 during your stay</li>
                {l.longStay && <li><Percent size={18} /> Long-stay discounts on request</li>}
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
              <Link className="text-link" href={areaHref}>All {home.region} homes <ArrowUpRight size={16} /></Link>
            </div>
            <div className="homes">{others.map((h) => <HomeCard key={h.slug} home={h} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
