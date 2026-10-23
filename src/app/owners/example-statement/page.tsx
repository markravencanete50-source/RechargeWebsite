import { ArrowRight, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SampleStatement } from "@/components/SampleStatement";
import { SubNav } from "@/components/SubNav";
import { PLATFORM_FEE } from "@/content/estimate-sums";
import { packShot } from "@/content/showcase";
import { site } from "@/content/site";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/owners/example-statement";

export const metadata: Metadata = {
  title: "Example owner statement",
  description: "An example of the monthly statement Recharge owners receive: every stay, fee and cost, followed from the booking to the money in your account.",
  alternates: { canonical: path },
};

export default function ExampleStatementPage() {
  const faqs = [
    { q: "Why is a finished stay sometimes on next month's statement?", a: "Because we pay from cleared funds. A stay goes on your statement once the platform's payout has reached the bank, never before." },
    { q: "Where do I find my statements?", a: "In your client portal in the Recharge app, every month, line by line." },
    { q: "Can I see where a figure came from?", a: "Yes. Every stay is matched to the platform payout and the money received in the bank. Our accounts team can show you how any figure was reached." },
    { q: "Do repairs come off without asking me?", a: "No. A repair only appears on your statement after you have approved the quote in the app." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Owners", path: "/owners" }, { name: "Example statement", path }]))} />
      <PageHero photo={packShot("R08")} eyebrow="For owners" title="Example statement" lead="This is how a monthly statement from the Recharge app reads. Tap any line to follow the money from the booking to your account." />
      <SubNav section="/owners" current={path} />

      <section className="section">
        <div className="wrap">
          <SampleStatement />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Line by line</p>
            <h2 className="h2">What each line means</h2>
            <p className="lead">Every statement has the same parts, in the same order.</p>
          </Reveal>
          <RowList items={[
            { title: "Stays paid out this month", text: "Each stay whose money has reached the bank, with its dates, the platform it came through and what the guest paid." },
            { title: "Platform fees", text: `What Airbnb, Booking.com and the others kept, about ${PLATFORM_FEE}% in our example. Direct bookings have none.` },
            { title: "Recharge management", text: "Our fee, as a percentage of the booking income." },
            { title: "Cleaning and laundry", text: "One line for the month, with the number of cleans. Every clean is finished with photo evidence." },
            { title: "Repairs", text: "Only the ones you approved in the app, each with the date it was quoted, approved and done." },
            { title: "Guest supplies", text: "Toilet roll, soap, tea and coffee." },
            { title: "Waiting for next month", text: "Stays that have finished but whose payout has not arrived yet. They move to the next statement once the money has cleared." },
          ]} />
        </div>
      </section>

      <FaqSection items={faqs} title="Statements and payouts" eyebrow="Questions" more={false} />

      <section className="section paper">
        <div className="wrap">
          <div className="note-line">
            <p><strong>Already an owner with us?</strong> Your own statements are in your client portal.</p>
            <a className="text-link" href={site.ownerLogin}><UserRound size={16} /> Owner login</a>
          </div>
          <div className="note-line" style={{ marginTop: 0, borderTop: 0 }}>
            <p><strong>Thinking of joining?</strong> Get a free performance estimate for your property.</p>
            <Link className="text-link" href="/owners#estimate">Get your free estimate <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
