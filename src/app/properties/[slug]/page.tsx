import { ArrowUpRight, Bath, ChevronRight, MessageSquareText, BedDouble, Bus, Check, CigaretteOff, Clock, CookingPot, DoorOpen, House, IdCard, Info, Landmark, LogOut, MapPin, Package, Percent, Phone, Pill, Plane, ShoppingCart, Sofa, TrainFront, Trees, TriangleAlert, Users, UtensilsCrossed, VolumeX, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmenityIcon } from "@/components/Amenity";
import { BookBar } from "@/components/BookBar";
import { BookingPanel } from "@/components/BookingPanel";
import { FaqList } from "@/components/FaqList";
import { Gallery } from "@/components/Gallery";
import { HomeCard } from "@/components/HomeCard";
import { JsonLd } from "@/components/JsonLd";
import { NearbyMap, type PlacePhoto } from "@/components/NearbyMap";
import { wantsPhoto } from "@/lib/place-photo";
import { Sheet } from "@/components/Sheet";
import { homeFaqs } from "@/content/faqs";
import { groupAmenities, parseListing, topAmenities, type Room } from "@/content/listing";
import { distance, heading, homeBySlug, homes, money, regionSlug, tags } from "@/content/properties";
import photoData from "@/content/place-photos.json";
import { site } from "@/content/site";
import { abs, breadcrumbs, faqPage, graph, organization } from "@/lib/schema";

// Checked at build time: a photo, or null where Wikipedia has no clear match.
const placePhotos = photoData as Record<string, PlacePhoto | null>;
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
    { id: "rooms", label: "Rooms", show: sleeping.length > 0 },
    { id: "amenities", label: "Amenities", show: home.amenities.length > 0 },
    { id: "nearby", label: "Location", show: true },
    { id: "good-to-know", label: "Good to know", show: true },
    { id: "questions", label: "Questions", show: faqs.length > 0 },
  ].filter((s) => s.show);
  const labelled = (line: string) => {
    const m = line.match(/^([^:]{3,40}):\s+(.+)$/);
    return m ? <><b>{m[1]}:</b> {m[2]}</> : line;
  };
  const popular = topAmenities(home.amenities, 10);
  const longAbout = l.intro.join(" ").length > 320;
  const placeList = (places: typeof l.places) => (
    <ul className="places">
      {places.map((p) => (
        <li key={p.name + p.time}>
          <span className="ic"><MapPin size={18} /></span>
          <div><strong>{p.name}</strong>{p.note && <span>{p.note}</span>}</div>
          {p.time && <em><Clock size={14} /> {p.time}</em>}
        </li>
      ))}
    </ul>
  );
  const osmList = home.nearby && home.nearby.length > 0 && (
    <ul className="nearby">
      {home.nearby.map((n) => {
        const Icon = NEARBY_ICON[n.kind] ?? MapPin;
        return <li key={n.kind}><span className="ic"><Icon size={20} /></span><div><strong>{n.name || n.label}</strong><span>{n.name ? `${n.label}, ` : ""}{distance(n.metres)}</span></div></li>;
      })}
    </ul>
  );
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
          <p className="prop-place"><span><MapPin size={17} /> {home.town}, {home.region} {home.district}</span>{home.reviews > 0 && <span><MessageSquareText size={16} /> {home.reviews} guest reviews</span>}</p>
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
                <section className="prop-block" id="overview">
                  <h2 className="h3">About this home</h2>
                  {l.highlights.length > 0 && (
                    <ul className="checks">{l.highlights.slice(0, 4).map((h) => <li key={h}><Check size={18} /> {h}</li>)}</ul>
                  )}
                  {l.intro.length > 0 && <div className={longAbout ? "clamp" : undefined}>{l.intro.map((p, i) => <p key={i}>{p}</p>)}</div>}
                  {(longAbout || inside.length > 0 || l.extra.length > 0 || l.highlights.length > 4) && (
                    <Sheet label={<>Show more <ChevronRight size={16} /></>} title="About this home">
                      {l.intro.map((p, i) => <p key={i}>{p}</p>)}
                      {l.highlights.length > 0 && <ul className="checks single">{l.highlights.map((h) => <li key={h}><Check size={18} /> {h}</li>)}</ul>}
                      {l.rooms.length > 0 && (
                        <>
                          <h3>The space</h3>
                          <div className="sheet-rooms">
                            {l.rooms.map((r) => {
                              const Icon = ROOM_ICON[r.kind];
                              return (
                                <div key={r.name}>
                                  <strong><Icon size={18} /> {r.name}</strong>
                                  <ul>{r.items.map((it) => <li key={it}>{labelled(it)}</li>)}</ul>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                      {l.extra.map((e) => (
                        <div key={e.title}>
                          <h3>{e.title}</h3>
                          {e.lines.map((p, i) => <p key={i}>{labelled(p)}</p>)}
                        </div>
                      ))}
                    </Sheet>
                  )}
                </section>
              )}

              {sleeping.length > 0 && (
                <section className="prop-block" id="rooms">
                  <h2 className="h3">Where you will sleep</h2>
                  <ul className="sleep-list">
                    {sleeping.map((r) => {
                      const Icon = ROOM_ICON[r.kind];
                      const beds = r.items.filter((it) => /bed|sofa|cot|bunk/i.test(it) && it.length < 70);
                      return (
                        <li key={r.name}>
                          <Icon size={22} strokeWidth={1.6} />
                          <strong>{r.name}</strong>
                          <span>{(beds.length ? beds : r.items.slice(0, 1)).map((it) => it.replace(/\s*\(sleeps \d+\)/i, "")).join(", ")}</span>
                          {r.sleeps && <em>Sleeps {r.sleeps}</em>}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {home.amenities.length > 0 && (
                <section className="prop-block" id="amenities">
                  <h2 className="h3">What this home offers</h2>
                  <ul className="amenities top">{popular.map((a) => <li key={a}><AmenityIcon name={a} /> {a}</li>)}</ul>
                  {home.amenities.length > popular.length && (
                    <Sheet label={`Show all ${home.amenities.length} amenities`} title="What this home offers">
                      <div className="amenity-groups">
                        {amenityGroups.map((g) => (
                          <div key={g.name}>
                            <h3>{g.name}</h3>
                            <ul className="amenities">{g.items.map((a) => <li key={a}><AmenityIcon name={a} /> {a}</li>)}</ul>
                          </div>
                        ))}
                      </div>
                    </Sheet>
                  )}
                </section>
              )}

              <section className="prop-block" id="nearby">
                <h2 className="h3">Where you will be</h2>
                <NearbyMap area={`${home.town} ${home.district}, ${home.region}`} town={home.town} places={l.places.slice(0, 8)} photos={Object.fromEntries(l.places.filter((p) => wantsPhoto(p.name) && `${p.name}|${home.town}` in placePhotos).map((p) => [p.name, placePhotos[`${p.name}|${home.town}`]]))} />
                {(l.places.length > 8 || l.placeNotes.length > 0 || (home.nearby?.length ?? 0) > 0) && (
                  <Sheet label={<>More about the area <ChevronRight size={16} /></>} title="What is nearby">
                    {l.places.length > 0 && placeList(l.places)}
                    {l.placeNotes.map((n) => <p key={n}>{labelled(n)}</p>)}
                    {home.nearby && home.nearby.length > 0 && <><h3>Everyday essentials</h3>{osmList}</>}
                    {l.places.some((p) => p.time) && <p className="fine">Travel times are approximate and given by the host.</p>}
                  </Sheet>
                )}
                {l.places.some((p) => p.time) && <p className="fine">Travel times are approximate and given by the host. Choose a place to see it on the map.</p>}
              </section>

              <section className="prop-block" id="good-to-know">
                <h2 className="h3">Good to know</h2>
                <div className="know">
                  <div>
                    <h3>Arriving and leaving</h3>
                    <ul className="rules">
                      {home.checkIn && <li><DoorOpen size={18} /> Check in from {home.checkIn}</li>}
                      {home.checkOut && <li><LogOut size={18} /> Check out by {home.checkOut}</li>}
                      <li><Phone size={18} /> Support 24/7 during your stay</li>
                    </ul>
                  </div>
                  {l.rules.length > 0 && (
                    <div>
                      <h3>House rules</h3>
                      <ul className="rules">
                        {l.rules.slice(0, 3).map((r) => {
                          const Icon = ruleIcon(r);
                          return <li key={r}><Icon size={18} /> {r}</li>;
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                {(l.rules.length > 3 || l.details.length > 0 || l.included.length > 0) && (
                  <Sheet label={<>Show more <ChevronRight size={16} /></>} title="Good to know">
                    <h3>House rules</h3>
                    <ul className="rules">
                      {l.rules.map((r) => {
                        const Icon = ruleIcon(r);
                        return <li key={r}><Icon size={18} /> {r}</li>;
                      })}
                    </ul>
                    {(l.details.length > 0 || l.included.length > 0) && (
                      <>
                        <h3>Included</h3>
                        <ul className="checks single">
                          {l.details.map((d) => <li key={d.text}><House size={18} /> <span>{d.label && <b>{d.label}: </b>}{d.text}</span></li>)}
                          {l.included.map((d) => <li key={d}><Check size={18} /> {d}</li>)}
                        </ul>
                      </>
                    )}
                  </Sheet>
                )}
              </section>

              {faqs.length > 0 && (
                <section className="prop-block" id="questions">
                  <h2 className="h3">Questions about this home</h2>
                  <FaqList items={faqs} />
                  <p className="fine">More answers on our <Link href="/faq">FAQ page</Link>, or see <Link href="/stay">how staying with Recharge works</Link>.</p>
                </section>
              )}
            </div>
            <aside className="book-card" aria-label="Book this home">
              <BookingPanel
                home={{ slug: home.slug, title: heading(home), town: home.town, price: home.price, currency: home.currency, maxGuests: home.guests, checkIn: home.checkIn, bookingUrl: home.bookingUrl ?? site.bookingUrl, longStay: l.longStay }}
                contact={{ phone: site.phone, email: site.email, discount: site.directDiscount }}
              />
              <ul className="facts">
                {facts.map((f) => <li key={f.text}><f.icon size={18} /> {f.text}</li>)}
                {home.checkIn && <li><DoorOpen size={18} /> Check in from {home.checkIn}</li>}
                <li><Clock size={18} /> Support 24/7 during your stay</li>
                {l.longStay && <li><Percent size={18} /> Long-stay discounts on request</li>}
              </ul>
              {home.licence && <p className="licence">Short-term let licence: {home.licence}</p>}
            </aside>
          </div>
        </div>
      </section>
      <BookBar>
        <div>
          {home.price !== undefined ? <p><strong>{money(home.price, home.currency)}</strong> a night</p> : <p><strong>Book direct</strong></p>}
          <span>Save {site.directDiscount} booking direct</span>
        </div>
        <a className="btn btn-primary" href="#book">Check dates</a>
      </BookBar>
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
