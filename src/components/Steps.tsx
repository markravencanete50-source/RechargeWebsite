import { Reveal } from "./Reveal";
import { StepsLine } from "./StepsLine";

export function Steps({ items }: { items: [string, string][] }) {
  return (
    <div className="steps">
      <StepsLine />
      {items.map(([t, d], i) => (
        <Reveal key={t} delay={0.15 + i * 0.18} className="step">
          <span className="step-num">{i + 1}</span>
          <strong className="h3">{t}</strong>
          <p>{d}</p>
        </Reveal>
      ))}
    </div>
  );
}
