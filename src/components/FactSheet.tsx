import { Reveal } from "./Reveal";

export type Fact = { title: string; note: string; count: number };

// A plain fact sheet: what the homes have and how many of them have it. The rule under each line fills to that share.
export function FactSheet({ items, total }: { items: Fact[]; total: number }) {
  return (
    <dl className="factsheet">
      {items.map((f, i) => (
        <Reveal key={f.title} delay={0.04 * i} className="factsheet-row">
          <dt>{f.title}<span>{f.note}</span></dt>
          <dd><strong>{f.count}</strong> / {total}</dd>
          <i aria-hidden style={{ width: `${(f.count / total) * 100}%` }} />
        </Reveal>
      ))}
    </dl>
  );
}
