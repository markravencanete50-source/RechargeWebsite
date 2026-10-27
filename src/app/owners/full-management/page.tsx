import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { OwnerEnquiry } from "@/components/OwnerEnquiry";
import { OwnerPlans } from "@/components/OwnerPlans";
import { PageHero } from "@/components/PageHero";
import { Proof } from "@/components/Proof";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { Steps } from "@/components/Steps";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { PLATFORM_FEE } from "@/content/estimate-sums";
import { packShot } from "@/content/showcase";
import { site } from "@/content/site";
import { abs, breadcrumbs, graph, organization } from "@/lib/schema";

const path = "/owners/full-management";

export const metadata: Metadata = {
  title: "Full short-let management in Scotland",
  description: "We run your property as a short let: listings, daily pricing, guests, cleaning, repairs and monthly statements from cleared funds. You keep the earnings after our fee.",
  alternates: { canonical: path },
};

export default async function FullManagementPage() {
  const { homes, regions, reviewTotal } = await getCatalog();
  const faqs = [
    { q: "What does full management include?", a: "Listings, daily pricing, guest messages, check-in, cleaning, laundry, repairs and monthly statements. You can see all of it in the Recharge app." },
    { q: "How is the management fee worked out?", a: "It is a percentage of the booking income. Your estimate sets out the rate before you sign, and the earnings calculator lets you try it with your own figures." },
    { q: "When am I paid?", a: "Once a month, from cleared funds. A stay goes on your statement when the platform's payout has reached the bank, never before." },
    { q: "Do I have to approve repairs?", a: "Only the ones over your limit. When your property is set up, you choose how much a repair can cost before we ask you: always ask, up to £100, £250, £500 or another amount. Repairs under it go ahead so guests are not left waiting, and we tell you after. Anything over it comes to you to approve in the app first. Furnishing is always quoted for your approval, and you see photos of the finished work." },
    { q: "Do I need a short-term let licence?", a: "In Scotland, short lets need a licence from the local council. We help you through the application and track your licence, renewals and deadlines in the app." },
    { q: "How do I see what is happening at my property?", a: "Through the Recharge client portal. You see bookings, performance, cleans, repairs, statements and payouts, and you approve costs from your phone." },
  ];
  return (
    <>
      <JsonLd data={graph(organization, { "@type": "Service", name: "Full short-let management", serviceType: "Serviced accommodation management", provider: { "@id": abs("/#organization") }, areaServed: regions.map((r) => ({ "@type": "Place", name: `${r.name}, Scotland` })), url: abs(path) }, breadcrumbs([{ name: "Owners", path: "/owners" }, { name: "Full management", path }]))} />
      <PageHero photo={packShot("R05")} eyebrow="For owners" title="Full management" lead="We run your property as a short let from start to finish. You keep the earnings after our fee, and you see every booking, cost and payout in the app." />
      <SubNav section="/owners" current={path} />

      <section className="section proof-band">
        <div className="wrap">
          <Proof items={[[String(homes.length), "homes we run today"], [String(regions.length), "areas across Scotland"], [reviewTotal.toLocaleString("en-GB"), "guest reviews on our homes"], ["24/7", "support for your guests"]]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">What we handle</p>
            <h2 className="h2">You own it. We run it.</h2>
            <p className="lead">One team covers everything a short let needs, from the first inspection to the monthly statement.</p>
            <Link className="btn btn-primary" href="#estimate">Get your free estimate <ArrowRight size={18} /></Link>
          </Reveal>
          <RowList items={[
            { title: "Setup and licensing", text: "Inspection, furnishing if you need it, photos, listings and help with your short-term let licence." },
            { title: "Pricing and listings", text: "Prices reviewed every day and listings checked so each one stays ready to book." },
            { title: "Guests, day and night", text: "Every message answered, with a real person on hand 24/7." },
            { title: "Cleaning and laundry", text: "Every clean checked with photos. Fresh linen and towels for every stay." },
            { title: "Repairs and safety checks", text: "Faults fixed quickly. Anything over your repair limit waits for your approval." },
            { title: "Statements and payouts", text: "Clear monthly statements, paid from cleared funds." },
          ]} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Your money</p>
            <h2 className="h2">How you are paid</h2>
            <p className="lead">Every month you get a statement that starts with the bookings and ends with what reaches your account.</p>
            <Link className="text-link" href="/owners/example-statement">See an example statement <ArrowRight size={16} /></Link>
          </Reveal>
          <RowList items={[
            { title: "Booking income", text: "What guests paid for the stays that finished and were paid out that month." },
            { title: "Platform fees", text: `Airbnb and Booking.com keep a fee, about ${PLATFORM_FEE}% in our sums. Stays booked direct on our website have none.` },
            { title: "Our management fee", text: "A percentage of the booking income, agreed before you sign." },
            { title: "Cleaning and running costs", text: "Cleans, laundry and guest supplies, line by line. Each repair with its photos and invoice." },
            { title: "Paid to you", text: "From cleared funds, once a month, with the statement in your client portal." },
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Or a fixed rent</p><h2 className="h2">Full management or guaranteed rent?</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">Full management gives you the earnings. <Link className="text-link" href="/guaranteed-rent">Guaranteed rent</Link> gives you the same amount every month.</p></Reveal>
          </div>
          <OwnerPlans />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2">From first enquiry to first guest</h2>
          </Reveal>
          <Steps items={[
            ["Tell us about your property", "Fill in the free estimate form. Your estimate comes by email, usually within 48 hours."],
            ["Review and choose", "See your estimate in the app, then choose what you do yourself and what we do for you."],
            ["Sign and get ready", "Sign the agreement in the app. We inspect, photograph and list the property, and do the parts of set-up you asked us to."],
            ["Guests arrive", "We run every stay. You follow along and get paid from cleared funds."],
          ]} />
          <Link className="text-link" href="/owners/onboarding" style={{ marginTop: 28, display: "inline-flex" }}>See every step of onboarding <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="section dark on-dark" id="estimate" style={{ scrollMarginTop: 80 }}>
        <div className="wrap contact">
          <Reveal>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <p className="eyebrow">Free performance estimate</p>
              <h2 className="h2">What could your property earn?</h2>
              <p className="lead">Tell us about your property. A member of the team will be in touch with your free performance estimate by email, usually within 48 hours. There is no obligation.</p>
            </div>
            <div className="contact-lines">
              <a href={site.phone.href}>{site.phone.display}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><OwnerEnquiry /></Reveal>
        </div>
      </section>

      <FaqSection items={faqs} title="Full management questions" eyebrow="Questions" more={false} />
    </>
  );
}
