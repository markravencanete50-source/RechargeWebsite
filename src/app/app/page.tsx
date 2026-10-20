import type { Metadata } from "next";
import { AppShowcase } from "@/components/AppShowcase";
import { DiffVideo } from "@/components/DiffVideo";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Recharge app",
  description: "One app for owners, guests, cleaners and maintenance, with 24/7 support behind it.",
  alternates: { canonical: "/app" },
};

export default function AppPage() {
  return (
    <>
      <PageHero eyebrow="The Recharge app" title="One app runs every home" lead="Owners, guest support, cleaners and maintenance all work from the same app. Every job has an owner, a status and a record." />

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Who uses it</p>
            <h2 className="h2">Each person sees what they need</h2>
            <p className="lead">For the homes they look after, and nothing else.</p>
          </Reveal>
          <AppShowcase />
        </div>
      </section>

      <section className="section dark on-dark">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Watch</p>
            <h2 className="h2">Why Recharge is different</h2>
          </Reveal>
          <Reveal><DiffVideo /></Reveal>
          <div className="diff-grid">
            {[
              ["Owners", "Live bookings, statements and approvals on your phone."],
              ["Guests", "Messages answered quickly, at any hour."],
              ["Cleaners", "Schedules, checklists and photo proof for every clean."],
              ["Maintenance", "Repairs logged, assigned and tracked to the finish."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="diff">
                <span className="num">0{i + 1}</span>
                <strong className="h3" style={{ fontSize: 20 }}>{t}</strong>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
