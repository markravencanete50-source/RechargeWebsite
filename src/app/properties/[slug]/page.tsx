import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { groupAmenities, parseListing, topAmenities } from "@/content/listing";
import { distance, heading, money, regionSlug, tags } from "@/content/home-utils";
import { getCatalog, homeIn } from "@/content/catalog";
import type { Home } from "@/content/home-utils";
import photoData from "@/content/place-photos.json";
import { site, withDirect } from "@/content/site";
import { abs, breadcrumbs, faqPage, graph, organization } from "@/lib/schema";

// Checked at build time: a photo, or null where Wikipedia has no clear match.
const placePhotos = photoData as Record<string, PlacePhoto | null>;


export async function generateStaticParams() {
  const { homes } = await getCatalog();
  return homes.map((h) => ({ slug: h.slug }));
}

function summary(home: Home, direct: string) {
  const intro = parseListing(home.description, home.houseRules).intro.join(" ");
  const base = `${heading(home)}, ${home.region}. ${home.guests ? `Sleeps ${home.guests}. ` : ""}Book direct with Recharge and save ${direct}.`;
  return (intro && intro.length > 60 ? intro.replace(/^Recharge Stays (is (proud|pleased) to present|proudly presents|presents)\s*/i, "").replace(/^./, (c) => c.toUpperCase()) : base).slice(0, 158);
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const catalog = await getCatalog();
  const home = homeIn(catalog, (await params).slug);
  if (!home) return {};
  const title = `${heading(home)}, ${home.region}`;
  return {
    title,
    description: summary(home, catalog.direct),
    alternates: { canonical: `/properties/${home.slug}` },
    openGraph: { title, description: summary(home, catalog.direct), url: `/properties/${home.slug}`, images: home.photos[0]?.src ? [home.photos[0].src] : undefined },
  };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const catalog = await getCatalog();
  const home = homeIn(catalog, (await params).slug);
  if (!home) notFound();
  const l = parseListing(home.description, home.houseRules);
  const sleeping = l.rooms.filter((r) => r.kind === "bedroom" || r.sleeps);
  const inside = l.rooms.filter((r) => !sleeping.includes(r));
  const amenityGroups = groupAmenities(home.amenities);
  const faqs = withDirect(homeFaqs(home, l), catalog.direct);
  const others = catalog.homes.filter((h) => h.slug !== home.slug && h.region === home.region).slice(0, 4);
  const facts = [
    home.guests ? `Sleeps ${home.guests}` : "",
    home.bedrooms === 0 ? "Studio" : `${home.bedrooms} bedroom${home.bedrooms === 1 ? "" : "s"}${home.beds ? `, ${home.beds} bed${home.beds === 1 ? "" : "s"}` : ""}`,
    home.bathrooms ? `${home.bathrooms} bathroom${home.bathrooms === 1 ? "" : "s"}` : "",
  ].filter(Boolean);
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
          <div><strong>{p.name}</strong>{p.note && <span>{p.note}</span>}</div>
          {p.time && <em>{p.time}</em>}
        </li>
      ))}
    </ul>
  );
  const osmList = home.nearby && home.nearby.length > 0 && (
    <ul className="nearby">
      {home.nearby.map((n) => <li key={n.kind}><div><strong>{n.name || n.label}</strong><span>{n.name ? `${n.label}, ` : ""}{distance(n.metres)}</span></div></li>)}
    </ul>
  );
  const areaHref = `/properties/area/${regionSlug(home.region)}`;

  const ld = graph(
    organization,
    {
      "@type": "VacationRental",
      "@id": abs(`/properties/${home.slug}#home`),
      name: heading(home),
      description: summary(home, catalog.direct),
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
          <p className="prop-place"><span>{home.town}, {home.region} {home.district}</span>{home.reviews > 0 && <span>{home.reviews} guest reviews</span>}</p>
          {(tags(home).length > 0 || l.longStay) && (
            <p className="prop-tags">{[l.longStay ? "Long-stay discounts" : "", ...tags(home)].filter(Boolean).join(" · ")}</p>
          )}
          <Gallery photos={home.photos} title={heading(home)} />

          <nav className="prop-nav" aria-label="On this page">
            {sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}
          </nav>

          <div className="prop">
            <div className="prop-main">
              <ul className="prop-facts">{facts.map((f) => <li key={f}>{f}</li>)}</ul>

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
                            {l.rooms.map((r) => (
                              <div key={r.name}>
                                <strong>{r.name}</strong>
                                <ul>{r.items.map((it) => <li key={it}>{labelled(it)}</li>)}</ul>
                              </div>
                            ))}
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
                      const beds = r.items.filter((it) => /bed|sofa|cot|bunk/i.test(it) && it.length < 70);
                      return (
                        <li key={r.name}>
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
                  <ul className="amenities top">{popular.map((a) => <li key={a}>{a}</li>)}</ul>
                  {home.amenities.length > popular.length && (
                    <Sheet label={`Show all ${home.amenities.length} amenities`} title="What this home offers">
                      <div className="amenity-groups">
                        {amenityGroups.map((g) => (
                          <div key={g.name}>
                            <h3>{g.name}</h3>
                            <ul className="amenities">{g.items.map((a) => <li key={a}>{a}</li>)}</ul>
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
                      {home.checkIn && <li>Check in from {home.checkIn}</li>}
                      {home.checkOut && <li>Check out by {home.checkOut}</li>}
                      <li>Support 24/7 during your stay</li>
                    </ul>
                  </div>
                  {l.rules.length > 0 && (
                    <div>
                      <h3>House rules</h3>
                      <ul className="rules">
                        {l.rules.slice(0, 3).map((r) => <li key={r}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                {(l.rules.length > 3 || l.details.length > 0 || l.included.length > 0) && (
                  <Sheet label={<>Show more <ChevronRight size={16} /></>} title="Good to know">
                    <h3>House rules</h3>
                    <ul className="rules">
                      {l.rules.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                    {(l.details.length > 0 || l.included.length > 0) && (
                      <>
                        <h3>Included</h3>
                        <ul className="rules">
                          {l.details.map((d) => <li key={d.text}><span>{d.label && <b>{d.label}: </b>}{d.text}</span></li>)}
                          {l.included.map((d) => <li key={d}>{d}</li>)}
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
                home={{ slug: home.slug, title: heading(home), town: home.town, region: home.region, price: home.price, currency: home.currency, maxGuests: home.guests, checkIn: home.checkIn, bookingUrl: home.bookingUrl ?? site.bookingUrl, longStay: l.longStay }}
                contact={{ phone: site.phone, email: site.email, discount: catalog.direct }}
                discounts={catalog.discounts.filter((d) => !d.region || d.region === home.region)}
              />
              <ul className="facts">
                {facts.map((f) => <li key={f}>{f}</li>)}
                {home.checkIn && <li>Check in from {home.checkIn}</li>}
                <li>Support 24/7 during your stay</li>
                {l.longStay && <li>Long-stay discounts on request</li>}
              </ul>
              {home.licence && <p className="licence">Short-term let licence: {home.licence}</p>}
            </aside>
          </div>
        </div>
      </section>
      <BookBar>
        <div>
          {home.price !== undefined ? <p><strong>{money(home.price, home.currency)}</strong> a night</p> : <p><strong>Book direct</strong></p>}
          <span>Save {catalog.direct} booking direct</span>
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
