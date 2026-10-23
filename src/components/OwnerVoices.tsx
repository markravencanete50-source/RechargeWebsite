import type { landlords } from "@/content/guaranteed";
import { Reveal } from "./Reveal";

// What landlords say, in their own words: one quote set large, two beneath it.
export function OwnerVoices({ items }: { items: typeof landlords }) {
  const [first, ...rest] = items;
  return (
    <div className="quotes">
      <Reveal as="div" className="quote quote-lead">
        <blockquote><p>{first.quote}</p></blockquote>
        <p className="quote-by"><strong>{first.name}</strong>, landlord in {first.place}</p>
      </Reveal>
      <div className="quote-pair">
        {rest.map((v, i) => (
          <Reveal key={v.name} className="quote" delay={0.08 * (i + 1)}>
            <blockquote><p>{v.quote}</p></blockquote>
            <p className="quote-by"><strong>{v.name}</strong>, landlord in {v.place}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
