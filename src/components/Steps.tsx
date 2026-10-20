import { Reveal } from "./Reveal";

export function Steps({ items }: { items: [string, string][] }) {
  return (
    <div className="steps">
      {items.map(([t, d], i) => (
        <Reveal key={t} delay={i * 0.08} className="step">
          <span className="step-num">{i + 1}</span>
          <strong className="h3">{t}</strong>
          <p>{d}</p>
        </Reveal>
      ))}
    </div>
  );
}
