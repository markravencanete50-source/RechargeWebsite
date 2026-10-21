import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

// A row of headline figures that count up as they come into view.
export function Proof({ items }: { items: [string, string][] }) {
  return (
    <div className="proof">
      {items.map(([n, t], i) => (
        <Reveal key={t} delay={i * 0.07} className="proof-item">
          <strong><CountUp value={n} /></strong>
          <span>{t}</span>
        </Reveal>
      ))}
    </div>
  );
}
