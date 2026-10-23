import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { SubNav } from "@/components/SubNav";
import { principles } from "@/content/about";
import { showcase } from "@/content/showcase";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/about/how-we-work";

export const metadata: Metadata = {
  title: "How we work",
  description: "The three things Recharge holds to: reliability, transparency and results, and what each one means for owners and guests in practice.",
  alternates: { canonical: path },
};

export default function HowWeWorkPage() {
  const faqs = [
    { q: "Who runs the homes day to day?", a: "Our own team: guest support, cleaning, maintenance and accounts. Everyone works from the Recharge app, and each person sees only the homes and jobs they look after." },
    { q: "How do owners know what is happening?", a: "Through the Recharge client portal. Owners see bookings, performance, cleans, repairs, statements and payouts, and approve costs from their phone." },
    { q: "How are cleaning standards kept up?", a: "Every clean is created from a booking, assigned to a cleaner and finished with photo evidence. Quality is tracked by cleaner and by property." },
    { q: "What happens when something breaks?", a: "A problem raised by a guest, cleaner or owner becomes a job. Maintenance quotes it, the owner approves it in the app, and the work is tracked to completion with photos." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "About", path: "/about" }, { name: "How we work", path }]))} />
      <PageHero photo={showcase.checked} eyebrow="About" title="How we work" lead="Three things we hold to, and what each one means in practice for the owners and guests who rely on us." />
      <SubNav section="/about" current={path} />

      <section className="section">
        <div className="wrap">
          <div className="tenets">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={0.08 * i} className="tenet">
                <h2 className="h3" style={{ margin: 0, fontSize: "clamp(28px, 3vw, 40px)", letterSpacing: "-0.03em" }}>{p.title}</h2>
                <p>{p.text}</p>
                <ul className="trip-points" style={{ marginTop: 8 }}>{p.proof.map((x) => <li key={x}>{x}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">One system</p>
            <h2 className="h2">Everyone works from the same app</h2>
            <p className="lead">Owners, guest support, cleaners, maintenance and accounts all use the Recharge app, so nothing depends on someone remembering.</p>
            <Link className="text-link" href="/app">See the app <ArrowRight size={16} /></Link>
          </Reveal>
          <RowList items={[
            { title: "Guest support", text: "Every message in one inbox, with a live response timer and the guest's stay beside it." },
            { title: "Cleaning", text: "Each clean created from a booking and finished with photo evidence." },
            { title: "Maintenance", text: "Problems become jobs with a quote, an approval and photos of the finished work." },
            { title: "Accounts", text: "Bookings matched to platform payouts and the bank, so statements show real money." },
            { title: "Owners", text: "A client portal with bookings, performance, statements, approvals and post." },
          ]} />
        </div>
      </section>

      <FaqSection items={faqs} title="How we work" eyebrow="Questions" />
    </>
  );
}
