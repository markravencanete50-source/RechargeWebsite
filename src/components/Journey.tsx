import { journey } from "@/content/tools";
import { Reveal } from "./Reveal";

// One booking followed through the app, step by step.
export function Journey() {
  return (
    <ol className="journey">
      {journey.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 0.07} className="journey-step">
          <span className="journey-num">{String(i + 1).padStart(2, "0")}</span>
          <strong>{s.title}</strong>
          <p>{s.text}</p>
          <span className="journey-tool">{s.tool}</span>
        </Reveal>
      ))}
    </ol>
  );
}
