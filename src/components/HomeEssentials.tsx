import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

export type Essential = { icon: LucideIcon; title: string; text: string; count: number };

// What the homes have, counted from the listings themselves, with a bar showing how many of them have it.
export function HomeEssentials({ items, total }: { items: Essential[]; total: number }) {
  return (
    <ul className="essentials">
      {items.map((e, i) => (
        <Reveal as="li" key={e.title} delay={0.05 * (i % 4)} className="essential">
          <span className="gr-ic"><e.icon size={22} /></span>
          <strong>{e.title}</strong>
          <span>{e.text}</span>
          <span className="essential-meter" aria-hidden><i style={{ width: `${Math.round((e.count / total) * 100)}%` }} /></span>
          <small>{e.count === total ? `All ${total} homes` : `${e.count} of ${total} homes`}</small>
        </Reveal>
      ))}
    </ul>
  );
}
