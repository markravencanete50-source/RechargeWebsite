import { Plus } from "lucide-react";
import type { Faq } from "@/content/faqs";

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}<span className="plus"><Plus size={18} /></span></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
