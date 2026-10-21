import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Numbered rows divided by hairlines: a quieter alternative to a grid of cards.
export function RowList({ items }: { items: { title: string; text: ReactNode; icon?: ReactNode }[] }) {
  return (
    <ol className="row-list">
      {items.map((it, i) => (
        <Reveal as="li" key={it.title} delay={i * 0.08} className="row-item">
          <span className="row-num">{String(i + 1).padStart(2, "0")}</span>
          <strong className="row-title">{it.icon && <span className="row-ic">{it.icon}</span>}{it.title}</strong>
          <p>{it.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
