import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Faq } from "@/content/faqs";
import { faqPage, graph } from "@/lib/schema";
import { FaqList } from "./FaqList";
import { JsonLd } from "./JsonLd";
import { Reveal } from "./Reveal";

// A page's own questions, with FAQPage structured data so answer engines can quote them.
export function FaqSection({ items, title = "Questions", eyebrow = "FAQ", lead, tone = "", more = true }: { items: Faq[]; title?: string; eyebrow?: string; lead?: string; tone?: string; more?: boolean }) {
  return (
    <section className={`section ${tone}`}>
      <JsonLd data={graph(faqPage(items))} />
      <div className="wrap faq-grid">
        <Reveal className="section-head">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="h2">{title}</h2>
          {lead && <p className="lead">{lead}</p>}
          {more && <Link className="text-link" href="/faq">All questions <ArrowRight size={16} /></Link>}
        </Reveal>
        <Reveal><FaqList items={items} /></Reveal>
      </div>
    </section>
  );
}
