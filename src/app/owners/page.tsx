import { ArrowRight, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { OwnerEnquiry } from "@/components/OwnerEnquiry";
import { OwnerPlans } from "@/components/OwnerPlans";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Steps } from "@/components/Steps";
import { ownerFaqs } from "@/content/faqs";
import { homes, regions, reviewTotal } from "@/content/properties";
import { site } from "@/content/site";
import { teams, toolCount } from "@/content/tools";
import { abs, breadcrumbs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Short-let management and guaranteed rent in Scotland",
  description: "Guaranteed rent or full short-let management in Glasgow, Edinburgh and across Scotland. Free performance estimate, and every booking, clean, repair and payout visible in the Recharge app.",
  alternates: { canonical: "/owners" },
};

const ownerTools = teams.find((t) => t.id === "owners")!.tools;

export default function OwnersPage() {
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
      <PageHero eyebrow="For property owners" title="Let us run your property" lead={`Guaranteed rent or full management. We run ${homes.length} homes across Scotland and you follow every booking, clean, repair and payout in the Recharge app.`}>
        <div className="hero-actions">
          <a className="btn btn-mint" href="#estimate">Get your free estimate <ArrowRight size={18} /></a>
          <Link className="btn btn-line-light" href="/app">See the owner app</Link>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="proof">
            {[
              [String(homes.length), "homes we run today"],
              [String(regions.length), "areas across Scotland"],
              [reviewTotal.toLocaleString("en-GB"), "guest reviews on our homes"],
              [String(toolCount), "tools in the Recharge app"],
            ].map(([n, t], i) => <Reveal key={t} delay={i * 0.06}><div><strong>{n}</strong><span>{t}</span></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Your options</p>
            <h2 className="h2">Two ways to work with us</h2>
            <p className="lead">Choose the arrangement that suits you. We handle everything else.</p>
          </Reveal>
          <OwnerPlans />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="section-link">
            <Reveal className="section-head">
              <p className="eyebrow">Your client portal</p>
              <h2 className="h2">See everything. Approve from your phone.</h2>
              <p className="lead">Every owner gets the Recharge client portal. These are the tools in it.</p>
            </Reveal>
            <Link className="text-link" href="/app#tools">All {toolCount} tools <ArrowRight size={18} /></Link>
          </div>
          <ul className="tool-grid">
            {ownerTools.map((t, i) => (
              <Reveal as="li" key={t.name} delay={i * 0.05} className="tool">
                <span className="ic"><t.icon size={20} /></span>
                <div><strong>{t.name}</strong><p>{t.does}</p></div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
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
              <a href={site.phone.href}><span className="ic"><Phone size={20} /></span>{site.phone.display}</a>
              <a href={`mailto:${site.email}`}><span className="ic"><Mail size={20} /></span>{site.email}</a>
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
            <Link href="/app"><strong>The Recharge app <ArrowRight size={16} /></strong><span>{toolCount} tools behind every home.</span></Link>
            <Link href="/properties"><strong>Homes we run <ArrowRight size={16} /></strong><span>See {homes.length} homes across Scotland.</span></Link>
            <Link href="/support"><strong>24/7 support <ArrowRight size={16} /></strong><span>Help for guests and owners at any hour.</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
