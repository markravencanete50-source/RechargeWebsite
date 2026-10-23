import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export type Stop = { mark: string; title: string; text: ReactNode };

// A stay from booking to check-out, along one line. The times on it come from the listings.
export function StayTimeline({ stops }: { stops: Stop[] }) {
  return (
    <ol className="journey">
      {stops.map((s, i) => (
        <Reveal as="li" key={s.title} delay={0.08 * i} className="journey-stop">
          <span className="journey-mark">{s.mark}</span>
          <span className="journey-dot" aria-hidden />
          <strong>{s.title}</strong>
          <p>{s.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
