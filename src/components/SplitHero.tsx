import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// A dark hero with the copy on the left and a moving visual on the right.
export function SplitHero({ eyebrow, title, lead, children, visual }: { eyebrow: string; title: ReactNode; lead?: string; children?: ReactNode; visual: ReactNode }) {
  return (
    <section className="app-hero split-hero dark on-dark">
      <div className="hero-motion" aria-hidden>
        <span className="glow g1" /><span className="glow g2" />
      </div>
      <div className="wrap app-hero-inner">
        <div className="app-hero-copy">
          <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
          <Reveal delay={0.06}><h1 className="h1 page-title">{title}</h1></Reveal>
          {lead && <Reveal delay={0.12}><p className="lead">{lead}</p></Reveal>}
          {children && <Reveal delay={0.18}>{children}</Reveal>}
        </div>
        <Reveal delay={0.2} className="split-hero-visual">{visual}</Reveal>
      </div>
    </section>
  );
}
