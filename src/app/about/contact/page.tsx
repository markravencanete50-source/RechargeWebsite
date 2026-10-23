import { ArrowRight, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SubNav } from "@/components/SubNav";
import { showcase } from "@/content/showcase";
import { site } from "@/content/site";
import { abs, breadcrumbs, graph, organization } from "@/lib/schema";

const path = "/about/contact";

export const metadata: Metadata = {
  title: "Contact Recharge",
  description: `Call ${site.phone.display} at any hour, email ${site.email}, or send us a message. For guests, owners and neighbours of Recharge homes in Scotland.`,
  alternates: { canonical: path },
};

export default function ContactPage() {
  const ld = graph(
    { "@type": "ContactPage", url: abs(path), name: "Contact Recharge", about: { "@id": abs("/#organization") } },
    { ...organization, contactPoint: { "@type": "ContactPoint", telephone: site.phone.href.replace("tel:", ""), email: site.email, contactType: "customer support", areaServed: "GB", availableLanguage: "English", hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" } } },
    breadcrumbs([{ name: "About", path: "/about" }, { name: "Contact", path }]),
  );
  return (
    <>
      <JsonLd data={ld} />
      <PageHero photo={showcase.supportHero} eyebrow="About" title="Contact us" lead={`One number for everything, answered at any hour: ${site.phone.display}. Or email us, or send a message below.`} />
      <SubNav section="/about" current={path} />

      <section className="section">
        <div className="wrap">
          <div className="channels">
            <Reveal className="channel">
              <p className="eyebrow">Phone, 24/7</p>
              <a className="channel-big" href={site.phone.href}>{site.phone.display}</a>
              <p>For anything urgent, and the fastest way to reach us.</p>
            </Reveal>
            <Reveal className="channel" delay={0.08}>
              <p className="eyebrow">Email</p>
              <a className="channel-big small" href={`mailto:${site.email}`}>{site.email}</a>
              <p>For bookings, owner enquiries and anything that can wait for a written reply.</p>
            </Reveal>
            <Reveal className="channel" delay={0.16}>
              <p className="eyebrow">Owners</p>
              <a className="channel-big small" href={site.ownerLogin}><UserRound size={20} /> Owner login</a>
              <p>Bookings, statements, approvals and repairs, in your client portal.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <Reveal className="section-head"><p className="eyebrow">The right place</p><h2 className="h2">Where to go for what</h2></Reveal>
          <ul className="child-index">
            <li><Link href="/support/report-a-problem"><strong>A problem during a stay</strong><span>Tell us which home and what is wrong. Urgent? Call us.</span><em aria-hidden>→</em></Link></li>
            <li><Link href="/support/report-a-problem"><strong>A concern about a home next door</strong><span>Report it, or call while it is happening.</span><em aria-hidden>→</em></Link></li>
            <li><Link href="/owners#estimate"><strong>Letting your property</strong><span>Get a free performance estimate.</span><em aria-hidden>→</em></Link></li>
            <li><Link href="/properties"><strong>Booking a stay</strong><span>Find a home and send a request.</span><em aria-hidden>→</em></Link></li>
            <li><Link href="/faq"><strong>A quick question</strong><span>The answer may already be in our questions and answers.</span><em aria-hidden>→</em></Link></li>
          </ul>
        </div>
      </section>

      <ContactSection title="Send us a message" lead="Ask us anything about a stay, or tell us about your property. A real person will reply." />

      <section className="section">
        <div className="wrap">
          <div className="note-line" style={{ marginTop: 0 }}>
            <p><strong>Want to know more about us first?</strong> Read how we started and how we work.</p>
            <Link className="text-link" href="/about">About Recharge <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
