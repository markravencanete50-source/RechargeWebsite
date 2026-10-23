import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export type Stop = { mark: string; title: string; text: ReactNode };

// A stay from booking to check-out, along one line. The times on it come from the listings.
export function StayTimeline({ stops }: { stops: Stop[] }) {
  return (
    <ol className="stay-line">
      {stops.map((s, i) => (
        <Reveal as="li" key={s.title} delay={0.08 * i} className="stay-stop">
          <span className="stay-mark">{s.mark}</span>
          <span className="stay-dot" aria-hidden />
          <strong>{s.title}</strong>
          <p>{s.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
