import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { FurnishingCalculator } from "@/components/FurnishingCalculator";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import type { Faq } from "@/content/faqs";
import { breadcrumbs, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Furnishing calculator for short-term lets",
  description: "Enter your rooms and beds and get a room-by-room list of everything a guest-ready short-term let needs, from bed linen to the fire blanket. Free, from the Recharge app.",
  alternates: { canonical: "/owners/furnishing-calculator" },
};

const faqs: Faq[] = [
  { q: "Where do the numbers come from?", a: "They are the rules our own setup team uses for every home we furnish, the same ones in the Recharge app. Each item shows its rule, for example 3 bed linen sets per bed: one on the bed, one in the wash and one spare." },
  { q: "Does the list include safety items?", a: "It includes the safety items we put in every home, such as a fire blanket in each kitchen and a first-aid kit. Your short-term let licence may ask for more, such as smoke and heat alarms or a gas safety certificate. We help with the licence as part of setting up a home." },
  { q: "Can Recharge furnish the property for me?", a: "Yes. Our Recharge Ready team quotes the furnishing item by item. You accept or reject the quote in the Recharge app, and we set the home up ready for its first guest." },
  { q: "Do I need to give my address?", a: "No. The calculator runs in your browser and nothing you enter is sent to us." },
];

export default function FurnishingCalculatorPage() {
  const path = "/owners/furnishing-calculator";
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Owners", path: "/owners" }, { name: "Furnishing calculator", path }]))} />
      <PageHero eyebrow="For owners" title="Furnishing calculator" lead="Tell us your rooms and beds. See everything a guest-ready home needs, room by room, with the reason for every number." />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <FurnishingCalculator />
          <p className="fine furn-more">Want to know what the home could earn once it is ready? <Link className="text-link" href="/owners#calculator">Try the earnings calculator <ArrowRight size={16} /></Link></p>
        </div>
      </section>
      <FaqSection items={faqs} title="About the calculator" eyebrow="Questions" tone="paper" />
    </>
  );
}
