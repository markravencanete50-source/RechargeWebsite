import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SupportClock } from "@/components/SupportClock";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "24/7 support",
  description: "Recharge support runs 24 hours a day, 7 days a week, for guests and property owners.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <>
      <PageHero eyebrow="24/7 support" title="Someone is always there" lead={`Guests, owners and our own team can reach Recharge at any hour. Call ${site.phone.display} or send us a message.`} />

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

      <ContactSection title="Send us a message" lead="For bookings, owner enquiries or anything else. For anything urgent during a stay, call us." />
    </>
  );
}
