import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { FaqList } from "@/components/FaqList";
import { OwnerPlans } from "@/components/OwnerPlans";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Steps } from "@/components/Steps";
import { ownerFaqs } from "@/content/faqs";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Property owners",
  description: "Guaranteed rent or full short-let management in Glasgow, Edinburgh and across Scotland, with everything visible in the Recharge app.",
  alternates: { canonical: "/owners" },
};

export default function OwnersPage() {
  return (
    <>
      <PageHero eyebrow="For property owners" title="Let us run your property" lead={`Guaranteed rent or full management. We look after ${site.homesManaged} homes and you follow every booking, clean, repair and payout in the Recharge app.`}>
        <div className="hero-actions">
          <a className="btn btn-mint" href="#contact">Get your free estimate <ArrowRight size={18} /></a>
          <Link className="btn btn-line-light" href="/app">See the owner app</Link>
        </div>
      </PageHero>

      <section className="section">
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
          <Reveal className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2">From first call to first guest</h2>
          </Reveal>
          <Steps items={[
            ["Tell us about your property", "Send a few details. We come back with an estimate."],
            ["Agree and sign", "Read the agreement and sign it inside the app."],
            ["We get it ready", "Inspection, furnishing, photos and listings, all handled."],
            ["Guests arrive", "We run every stay. You follow along in the app."],
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap faq-grid">
          <Reveal className="section-head">
            <p className="eyebrow">Owner questions</p>
            <h2 className="h2">Good to know</h2>
          </Reveal>
          <Reveal><FaqList items={ownerFaqs} /></Reveal>
        </div>
      </section>

      <ContactSection title="Get your free estimate" lead="Tell us about your property and we will come back to you with an estimate." />
    </>
  );
}
