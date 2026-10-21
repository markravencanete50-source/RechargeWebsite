import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// The forest band at the top of every inner page, with slow drifting light and rings behind it.
export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: string; children?: ReactNode }) {
  return (
    <section className="page-hero dark on-dark">
      <div className="hero-motion" aria-hidden>
        <span className="glow g1" /><span className="glow g2" />
        <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
        <span className="dot d1" /><span className="dot d2" /><span className="dot d3" />
      </div>
      <div className="wrap">
        <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
        <Reveal delay={0.05}><h1 className="h1 page-title">{title}</h1></Reveal>
        {lead && <Reveal delay={0.1}><p className="lead">{lead}</p></Reveal>}
        {children && <Reveal delay={0.15}><div className="page-hero-extra">{children}</div></Reveal>}
      </div>
    </section>
  );
}
