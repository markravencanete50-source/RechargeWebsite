import { ArrowRight, Baby, BedDouble, Camera, Car, Clock, CookingPot, Flame, IdCard, MessageSquareText, ShieldCheck, Shirt, Wifi } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AreaIndex } from "@/components/AreaIndex";
import { FaqSection } from "@/components/FaqSection";
import { HomeEssentials } from "@/components/HomeEssentials";
import { JsonLd } from "@/components/JsonLd";
import { PhotoHero } from "@/components/PhotoHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { ReasonList } from "@/components/WhyChoose";
import { SearchBar } from "@/components/SearchBar";
import { Steps } from "@/components/Steps";
import { TripGrid } from "@/components/TripGrid";
import { guestFaqs } from "@/content/faqs";
import { getCatalog } from "@/content/catalog";
import { showcase } from "@/content/showcase";
import { site, withDirect } from "@/content/site";
import { guestReasons } from "@/content/why";
import { breadcrumbs, graph } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const { direct } = await getCatalog();
  return {
    title: "Stays",
    description: `Serviced apartments and homes across Scotland for city breaks, work trips, contractors and families. Book direct and save ${direct}.`,
    alternates: { canonical: "/stay" },
  };
}

// The most common value in a list, and how many homes differ from it.
function usual(values: string[]) {
  const tally = new Map<string, number>();
  for (const v of values) if (v) tally.set(v, (tally.get(v) ?? 0) + 1);
  const [value = "", n = 0] = [...tally].sort((a, b) => b[1] - a[1])[0] ?? [];
  return { value, others: values.length - n };
}

export default async function StayPage() {
  const { homes, regions, towns, reviewTotal, priceSteps, direct } = await getCatalog();
  const has = (re: RegExp) => homes.filter((h) => h.amenities.some((a) => re.test(a))).length;
  const essentials = [
    { icon: CookingPot, title: "A kitchen", text: "Cook a proper meal. Most come with an oven, microwave, kettle and toaster.", count: has(/kitchen/i) },
    { icon: Wifi, title: "Wifi", text: "Details are sent with your check-in information.", count: has(/wi-?fi|wireless|internet/i) },
    { icon: BedDouble, title: "Fresh linen and towels", text: "Beds made up and towels laid out before you arrive.", count: has(/linen|towel|essentials/i) },
    { icon: Shirt, title: "A washing machine", text: "Useful for longer stays, work trips and families.", count: has(/washing machine|washer/i) },
    { icon: Flame, title: "Heating and hot water", text: "Warm rooms and a hot shower, whatever the Scottish weather.", count: has(/heating/i) },
    { icon: Car, title: "Parking", text: "Free, private or street parking. Each home shows which.", count: has(/parking/i) },
    { icon: Baby, title: "Suitable for children", text: "Check the beds in every room on the home's page.", count: has(/child|famil/i) },
    { icon: ShieldCheck, title: "Smoke alarm", text: "Most homes also have a carbon monoxide alarm, a fire extinguisher and a first aid kit.", count: has(/smoke/i) },
  ].filter((e) => e.count > 0).sort((a, b) => b.count - a.count);
  const checkIn = usual(homes.map((h) => h.checkIn ?? ""));
  const checkOut = usual(homes.map((h) => h.checkOut ?? ""));
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Stays", path: "/stay" }]))} />
      <PhotoHero shot={showcase.stayHero} eyebrow="Stays" title={<>A whole home,<br />ready when you arrive</>} lead={`${homes.length} serviced homes across Scotland for city breaks, work trips and families. Book direct and save ${direct}.`}>
        <SearchBar data={{ regions, towns, priceSteps }} />
      </PhotoHero>

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes to choose from"], [String(regions.length), "areas of Scotland"], [reviewTotal.toLocaleString("en-GB"), "reviews from past guests"], ["24/7", "help from a real person"]]} />
        </div>
      </section>

      <section className="section" id="book-direct" style={{ scrollMarginTop: 80 }}>
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Why guests choose Recharge</p>
            <h2 className="h2">Save <span className="big-figure">{direct}</span> and deal with us, not a platform.</h2>
            <p className="lead">Same home, same dates, a better rate. And the team that runs the home is the team you talk to.</p>
            <Link className="btn btn-primary" href="/properties">Find a home <ArrowRight size={18} /></Link>
          </Reveal>
          <ReasonList items={withDirect(guestReasons, direct)} />
        </div>
      </section>

      <section className="section paper" id="trips" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Who stays with us</p><h2 className="h2">Homes for every kind of trip</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">A home rather than a hotel room. Full kitchens, space to spread out and parking at most of our homes.</p></Reveal>
          </div>
          <TripGrid trips={[
            { title: "Families and groups", text: "Homes that sleep up to 10, with room for everyone.", href: "/properties?guests=6", cta: "Homes for 6 or more", shot: showcase.families },
            { title: "Contractors and crews", text: "Whole homes with parking and kitchens.", href: "/properties?beds=3", cta: "3 bedrooms or more", shot: showcase.contractors },
            { title: "Business travel", text: "Quiet, central homes with support at any hour.", href: "/properties?area=Edinburgh", cta: "Homes in Edinburgh", shot: showcase.business },
            { title: "Longer stays", text: "Relocations, renovations and insurance stays.", href: "/properties", cta: "See every home", shot: showcase.longStays },
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Your stay</p>
            <h2 className="h2">Four steps, no surprises</h2>
          </Reveal>
          <Steps items={[
            ["Book", "Choose your home and dates and book direct."],
            ["Get your details", "We send the address, access instructions and wifi before you arrive."],
            ["Arrive", "Let yourself in. The home is cleaned and ready."],
            ["Check out", "Leave the keys as instructed. We take it from there."],
          ]} />
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap media-split">
          <Reveal className="media-frame">
            {showcase.checked && <Image src={showcase.checked.src} alt={showcase.checked.caption} fill sizes="(max-width: 900px) 100vw, 50vw" />}
          </Reveal>
          <div>
            <Reveal className="section-head">
              <p className="eyebrow">Every stay</p>
              <h2 className="h2">Checked before you arrive. Looked after while you are there.</h2>
            </Reveal>
            <RowList items={[
              { icon: <Camera size={18} />, title: "Photo-checked cleans", text: "Each clean is created from your booking and finished with photo evidence." },
              { icon: <MessageSquareText size={18} />, title: "Fast replies", text: "Guest messages are tracked with live response timers, day and night." },
              { icon: <Clock size={18} />, title: "Problems fixed", text: "A fault you report becomes a repair job, followed to the finish." },
            ]} />
          </div>
        </div>
      </section>

      <section className="section" id="every-home" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">In the home</p><h2 className="h2">What our homes have</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Counted from our own listings, so the numbers are real. Each home&apos;s page lists everything it has.</p></Reveal>
          </div>
          <HomeEssentials items={essentials} total={homes.length} />
        </div>
      </section>

      <section className="section paper" id="good-to-know" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Good to know</p>
            <h2 className="h2">Check-in, check-out and house rules</h2>
          </Reveal>
          <div className="know">
            <Reveal className="know-times">
              <div><small>Check in from</small><strong>{checkIn.value}</strong></div>
              <span className="know-line" aria-hidden />
              <div><small>Check out by</small><strong>{checkOut.value}</strong></div>
              <p>{checkIn.others || checkOut.others ? "These are the usual times. A few homes differ, and each home's page shows its own." : "The same at every home."}</p>
            </Reveal>
            <Reveal className="know-card" delay={0.06}>
              <span className="gr-ic"><IdCard size={22} /></span>
              <h3>Before you arrive</h3>
              <p>We send the address, access instructions and wifi before your stay. Some homes ask each guest to complete a short registration and ID check through a secure link.</p>
            </Reveal>
            <Reveal className="know-card" delay={0.12}>
              <span className="gr-ic"><ShieldCheck size={22} /></span>
              <h3>House rules</h3>
              <p>No parties or loud music. No smoking or vaping, inside or outside the home. Please treat the home and the neighbours with care.</p>
            </Reveal>
            <Reveal className="know-card" delay={0.18}>
              <span className="gr-ic"><Clock size={22} /></span>
              <h3>Need more time?</h3>
              <p>To extend your stay, or ask about a long-stay rate, call <a href={site.phone.href}>{site.phone.display}</a> or message us. We check the dates and come back to you.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Where to stay</p><h2 className="h2">{regions.length} areas, {homes.length} homes</h2></Reveal>
            <Reveal delay={0.08}><Link className="text-link" href="/properties">Search all homes <ArrowRight size={18} /></Link></Reveal>
          </div>
          <AreaIndex />
        </div>
      </section>

      <FaqSection items={withDirect(guestFaqs, direct)} title="Before you book" eyebrow="Guest questions" tone="paper" id="questions" />
    </>
  );
}
