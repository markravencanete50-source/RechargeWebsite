import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Steps } from "@/components/Steps";
import { SupportClock } from "@/components/SupportClock";
import { supportFaqs } from "@/content/faqs";
import { homes } from "@/content/properties";
import { site } from "@/content/site";
import { breadcrumbs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = {
  title: "24/7 support",
  description: `Recharge support runs 24 hours a day, 7 days a week, for guests and property owners. Call ${site.phone.display}.`,
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  const ld = graph(
    {
      ...organization,
      contactPoint: { "@type": "ContactPoint", telephone: site.phone.href.replace("tel:", ""), email: site.email, contactType: "customer support", areaServed: "GB", availableLanguage: "English", hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" } },
    },
    breadcrumbs([{ name: "Support", path: "/support" }]),
  );
  return (
    <>
      <JsonLd data={ld} />
      <PageHero eyebrow="24/7 support" title="Someone is always there" lead={`Guests, owners and our own team can reach Recharge at any hour. Call ${site.phone.display} or send us a message.`}>
        <div className="hero-actions">
          <a className="btn btn-mint" href={site.phone.href}>Call {site.phone.display}</a>
          <a className="btn btn-line-light" href="#contact">Send a message</a>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap support">
          <div>
            <Reveal className="section-head">
              <p className="eyebrow">Who we help</p>
              <h2 className="h2">Urgent problems go straight to the right person</h2>
            </Reveal>
            <div className="cards-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[
                ["Guests", "Help with check-in, wifi or anything in the home."],
                ["Owners", "Answers on bookings, statements and repairs."],
                ["Cleaners", "Report a problem from the phone and it goes to the right team."],
                ["Maintenance", "Urgent repairs sent out, day or night."],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.06} className="card"><strong className="h3">{t}</strong><p>{d}</p></Reveal>
              ))}
            </div>
          </div>
          <Reveal className="support-dial"><SupportClock /></Reveal>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Behind the phone</p>
            <h2 className="h2">What happens when you get in touch</h2>
            <p className="lead">Support is not a voicemail. Every message is logged in the Recharge app, so nothing is lost between shifts.</p>
          </Reveal>
          <Steps items={[
            ["You call or message", "Any hour, any day. A real person picks it up."],
            ["It is logged", "Guest messages go into one inbox with a live response timer and an escalation path."],
            ["It goes to the right team", "A fault becomes a repair job. Low supplies become a restock request. Nothing relies on memory."],
            ["You are kept updated", "Owners see the job, the quote and the photos when it is done, in the app."],
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="next-links">
            <Link href="/stay"><strong>Staying with us <ArrowRight size={16} /></strong><span>How a Recharge stay works.</span></Link>
            <Link href="/owners"><strong>For owners <ArrowRight size={16} /></strong><span>Guaranteed rent or full management.</span></Link>
            <Link href="/app#tools"><strong>The tools behind support <ArrowRight size={16} /></strong><span>The communication centre, repairs and more.</span></Link>
            <Link href="/properties"><strong>Find a home <ArrowRight size={16} /></strong><span>{homes.length} homes across Scotland.</span></Link>
          </div>
        </div>
      </section>

      <FaqSection items={supportFaqs} title="Support questions" eyebrow="Questions" tone="paper" />

      <ContactSection title="Send us a message" lead="For bookings, owner enquiries or anything else. For anything urgent during a stay, call us." />
    </>
  );
}
