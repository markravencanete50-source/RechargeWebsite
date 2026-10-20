import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// The forest band at the top of every inner page.
export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: string; children?: ReactNode }) {
  return (
    <section className="page-hero dark on-dark">
      <div className="wrap">
        <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
        <Reveal delay={0.05}><h1 className="h1 page-title">{title}</h1></Reveal>
        {lead && <Reveal delay={0.1}><p className="lead">{lead}</p></Reveal>}
        {children && <Reveal delay={0.15}><div className="page-hero-extra">{children}</div></Reveal>}
      </div>
    </section>
  );
}
