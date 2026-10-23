import { ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { Situations } from "@/components/Situations";
import { SplitHero } from "@/components/SplitHero";
import { SubNav } from "@/components/SubNav";
import { Steps } from "@/components/Steps";
import { SupportLive } from "@/components/SupportLive";
import { supportExtraFaqs, supportFaqs } from "@/content/faqs";
import { getCatalog } from "@/content/catalog";
import { packShot } from "@/content/showcase";
import { site } from "@/content/site";
import { breadcrumbs, graph, organization } from "@/lib/schema";

export const metadata: Metadata = {
  title: "24/7 support",
  description: `Recharge support runs 24 hours a day, 7 days a week, for guests, owners and neighbours. Call ${site.phone.display} at any hour.`,
  alternates: { canonical: "/support" },
};

export default async function SupportPage() {
  const { homes, regions } = await getCatalog();
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
      <SplitHero
        eyebrow="24/7 support"
        title={<>Someone is<br />always there</>}
        lead={`Guests, owners and neighbours can reach a real person at any hour. One number for everything: ${site.phone.display}.`}
        visual={<SupportLive phone={site.phone.display} />}
        photo={packShot("S03", "60% 50%")}
      >
        <div className="hero-actions">
          <a className="btn btn-mint" href={site.phone.href}><Phone size={18} /> Call {site.phone.display}</a>
          <Link className="btn btn-line-light" href="/support/report-a-problem">Report a problem</Link>
        </div>
      </SplitHero>
      <SubNav section="/support" current="/support" />

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[["24/7", "a real person, day and night"], ["365", "days a year, weekends included"], [String(homes.length), "homes covered"], [String(regions.length), "areas across Scotland"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="channels">
            <Reveal className="channel">
              <p className="eyebrow">Urgent or during a stay</p>
              <a className="channel-big" href={site.phone.href}>{site.phone.display}</a>
              <p>Answered 24 hours a day. The fastest way to reach us.</p>
            </Reveal>
            <Reveal className="channel" delay={0.08}>
              <p className="eyebrow">Bookings and general questions</p>
              <a className="channel-big small" href={`mailto:${site.email}`}>{site.email}</a>
              <p>For anything that can wait for a written reply.</p>
            </Reveal>
            <Reveal className="channel" delay={0.16}>
              <p className="eyebrow">Owners</p>
              <a className="channel-big small" href={site.ownerLogin}>Owner login</a>
              <p>Your client portal: bookings, statements, approvals and repairs, in one place.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="note-line" style={{ marginTop: 0 }}>
            <p><strong>Something wrong with a stay or a home next door?</strong> Tell us which home and what is wrong, and the team on duty replies.</p>
            <Link className="text-link" href="/support/report-a-problem">Report a problem <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">If this happens</p><h2 className="h2">What we do, situation by situation</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">The common reasons people get in touch, and exactly what happens next.</p></Reveal>
          </div>
          <Situations items={[
            { who: "Guests", situation: "I cannot get in", answer: `Call ${site.phone.display} straight away. We talk you through access and arrange help if it is needed.` },
            { who: "Guests", situation: "Something in the home is broken", answer: "Tell us and it becomes a repair job in the app. Urgent faults go straight to our maintenance team." },
            { who: "Guests", situation: "We are running low on supplies", answer: "Let us know what you need. Supplies that run low are tracked until they are replaced." },
            { who: "Guests", situation: "I do not have my check-in details", answer: "Call or email us and we send the address and access instructions again." },
            { who: "Guests", situation: "I want to stay longer", answer: "We check whether the home is free for the extra nights and how a longer stay is priced." },
            { who: "Neighbours", situation: "I have a concern about a Recharge home", answer: "Call at any hour. Your concern is logged and passed to the team responsible for that home." },
            { who: "Owners", situation: "I have a question about my statement", answer: "Our accounts team can show how each figure was matched to platform payouts and bank receipts." },
            { who: "Owners", situation: "A repair needs my approval", answer: "The quote appears in your client portal. Approve it with a tap and see the photos when the work is done." },
          ]} />
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap media-split">
          <Reveal className="support-phone">
            <PhoneFrame src="/app/stays.webp" alt="Recharge app: the guest support inbox" />
          </Reveal>
          <div>
            <Reveal className="section-head">
              <p className="eyebrow">Behind the phone</p>
              <h2 className="h2">Support is not a voicemail.</h2>
              <p className="lead">Every call and message is logged in the Recharge app, so nothing is lost between shifts.</p>
            </Reveal>
            <RowList items={[
              { title: "One inbox", text: "Every guest conversation in one place, with the guest's stay and history beside it." },
              { title: "Live response timers", text: "Each message shows how long it has waited, so none is left unanswered." },
              { title: "Problems become jobs", text: "A fault becomes a repair job with an owner and a status, followed to the finish." },
            ]} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Step by step</p>
            <h2 className="h2">What happens when you get in touch</h2>
          </Reveal>
          <Steps items={[
            ["You call or message", "Any hour, any day. A real person picks it up."],
            ["It is logged", "Your message goes into one inbox with a live response timer and an escalation path."],
            ["It goes to the right team", "A fault becomes a repair job. Low supplies become a restock request."],
            ["You are kept updated", "Guests hear back from us. Owners see the job, the quote and the photos in the app."],
          ]} />
        </div>
      </section>

      <FaqSection items={[...supportFaqs, ...supportExtraFaqs]} title="Support questions" eyebrow="Questions" tone="paper" />

      <section className="section">
        <div className="wrap">
          <div className="next-links">
            <Link href="/stay"><strong>Staying with us <ArrowRight size={16} /></strong><span>How a Recharge stay works.</span></Link>
            <Link href="/owners"><strong>For owners <ArrowRight size={16} /></strong><span>Guaranteed rent or full management.</span></Link>
            <Link href="/app/how-it-works"><strong>The app behind support <ArrowRight size={16} /></strong><span>One booking, followed start to finish.</span></Link>
            <Link href="/faq"><strong>All questions <ArrowRight size={16} /></strong><span>Answers for guests, owners and neighbours.</span></Link>
          </div>
        </div>
      </section>

      <ContactSection title="Send us a message" lead="For bookings, owner enquiries or anything else. For anything urgent during a stay, call us." />
    </>
  );
}
