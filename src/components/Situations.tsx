import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

// "If this happens, this is what we do": a two-column guide, not a grid of cards.
export function Situations({ items }: { items: { icon: LucideIcon; who: string; situation: string; answer: string }[] }) {
  return (
    <ul className="situations">
      {items.map((s, i) => (
        <Reveal as="li" key={s.situation} delay={(i % 4) * 0.06} className="situation">
          <div className="situation-q">
            <span className="row-ic"><s.icon size={20} /></span>
            <div><em>{s.who}</em><strong>{s.situation}</strong></div>
          </div>
          <p>{s.answer}</p>
        </Reveal>
      ))}
    </ul>
  );
}
