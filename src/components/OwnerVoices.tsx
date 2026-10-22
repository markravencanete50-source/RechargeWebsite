import type { landlords } from "@/content/guaranteed";
import { Reveal } from "./Reveal";

// What landlords say, in their own words: one large quote and two smaller ones beside it.
export function OwnerVoices({ items }: { items: typeof landlords }) {
  const [first, ...rest] = items;
  return (
    <div className="voices">
      <Reveal className="voice lead-voice">
        <span className="voice-mark" aria-hidden>“</span>
        <blockquote><p>{first.quote}</p></blockquote>
        <footer><strong>{first.name}</strong><span>Landlord, {first.place}</span></footer>
      </Reveal>
      {rest.map((v, i) => (
        <Reveal key={v.name} className="voice" delay={0.08 * (i + 1)}>
          <blockquote><p>{v.quote}</p></blockquote>
          <footer><strong>{v.name}</strong><span>Landlord, {v.place}</span></footer>
        </Reveal>
      ))}
    </div>
  );
}
