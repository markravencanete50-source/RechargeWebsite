import { ArrowRight, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { OwnerEnquiry } from "@/components/OwnerEnquiry";
import { OwnerPortal } from "@/components/OwnerPortal";
import { OwnerPlans } from "@/components/OwnerPlans";
import { PhotoHero } from "@/components/PhotoHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { ReasonList } from "@/components/WhyChoose";
import { Steps } from "@/components/Steps";
import { ChildIndex, SubNav } from "@/components/SubNav";
import { ownerFaqs } from "@/content/faqs";
import { getCatalog } from "@/content/catalog";
import { showcase } from "@/content/showcase";
import { site } from "@/content/site";
import { ownerReasons } from "@/content/why";
import { abs, breadcrumbs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Short-let management and guaranteed rent in Scotland",
  description: "Guaranteed rent or full short-let management in Glasgow, Edinburgh and across Scotland. Free performance estimate, and every booking, repair and payout visible in your own client portal.",
  alternates: { canonical: "/owners" },
};

export default async function OwnersPage() {
  const { homes, regions, reviewTotal } = await getCatalog();
  const ld = graph(
    organization,
    {
      "@type": "Service",
      name: "Short-let property management",
      serviceType: "Serviced accommodation management",
      provider: { "@id": abs("/#organization") },
      areaServed: regions.map((r) => ({ "@type": "Place", name: `${r.name}, Scotland` })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Ways to work with Recharge",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Guaranteed rent", description: "A fixed monthly rent, whether the property is booked or not." } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Full management", description: "Listings, pricing, guests, cleaning, repairs and statements, run through the Recharge app." } },
        ],
      },
    },
    breadcrumbs([{ name: "Owners", path: "/owners" }]),
  );

  return (
    <>
      <JsonLd data={ld} />
      <PhotoHero
        shot={showcase.ownerHero}
        eyebrow="For property owners"
        title={<>Your property,<br />run properly</>}
        lead={`Guaranteed rent or full management across Scotland. We run ${homes.length} homes today, and you see every booking, repair and payout in your own client portal.`}
      >
        <div className="hero-actions">
          <a className="btn btn-mint" href="#estimate">Get your free estimate <ArrowRight size={18} /></a>
          <a className="btn btn-line-light" href="#portal">See the owner portal</a>
        </div>
      </PhotoHero>
      <SubNav section="/owners" current="/owners" />

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes we run today"], [String(regions.length), "areas across Scotland"], [reviewTotal.toLocaleString("en-GB"), "guest reviews on our homes"], ["24/7", "support for you and your guests"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">For owners</p><h2 className="h2">Everything for owners</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">The two ways to work with us, and the tools to work out what your property could earn.</p></Reveal>
          </div>
          <ChildIndex section="/owners" />
        </div>
      </section>

      <section className="section">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Why owners choose Recharge</p>
            <h2 className="h2">Hands off, never in the dark.</h2>
            <p className="lead">We run the property day to day. You see every booking, cost and payout, and you approve anything we spend.</p>
            <a className="btn btn-primary" href="#estimate">Get your free estimate <ArrowRight size={18} /></a>
          </Reveal>
          <ReasonList items={ownerReasons} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Your options</p><h2 className="h2">Two ways to work with us</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Choose the arrangement that suits you. We handle everything else.</p></Reveal>
          </div>
          <OwnerPlans />
        </div>
      </section>

      <section className="section" id="portal" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Your client portal</p><h2 className="h2">See everything. Approve from your phone.</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Every owner gets their own login to the Recharge client portal. This is what you see in it.</p></Reveal>
          </div>
          <OwnerPortal />
          <p className="portal-login">Already an owner with us? <a className="btn btn-primary" href={site.ownerLogin}><UserRound size={18} /> Owner login</a></p>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2">From first enquiry to first guest</h2>
          </Reveal>
          <Steps items={[
            ["Tell us about your property", "Fill in the free estimate form. We come back with a performance estimate."],
            ["Agree and sign", "Read the agreement and sign it inside the app."],
            ["We get it ready", "Inspection, furnishing, licensing, photos and listings, all tracked in your portal."],
            ["Guests arrive", "We run every stay. You follow along and get paid from cleared funds."],
          ]} />
        </div>
      </section>

      <section className="section dark on-dark" id="estimate" style={{ scrollMarginTop: 80 }}>
        <div className="wrap contact">
          <Reveal>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <p className="eyebrow">Free performance estimate</p>
              <h2 className="h2">What could your property earn?</h2>
              <p className="lead">Tell us about your property and a member of the team will be in touch with a free performance estimate. There is no obligation.</p>
            </div>
            <div className="contact-lines">
              <a href={site.phone.href}>{site.phone.display}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><OwnerEnquiry /></Reveal>
        </div>
      </section>

      <FaqSection items={ownerFaqs} title="Owner questions" eyebrow="Questions" />

      <section className="section paper">
        <div className="wrap">
          <h2 className="h3" style={{ marginBottom: 16 }}>Keep reading</h2>
          <div className="next-links">
            <Link href="/app"><strong>The Recharge app <ArrowRight size={16} /></strong><span>How our team runs every home.</span></Link>
            <Link href="/properties"><strong>Homes we run <ArrowRight size={16} /></strong><span>See {homes.length} homes across Scotland.</span></Link>
            <Link href="/support"><strong>24/7 support <ArrowRight size={16} /></strong><span>Help for guests and owners at any hour.</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
