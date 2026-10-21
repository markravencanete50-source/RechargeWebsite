import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Shot } from "@/content/showcase";
import { Reveal } from "./Reveal";

// A full-bleed hero on a real Recharge home, with a slow push-in on the photo.
export function PhotoHero({ shot, eyebrow, title, lead, children, aside }: { shot: Shot | null; eyebrow: string; title: ReactNode; lead?: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="photo-hero on-dark">
      {shot && (
        <div className="photo-hero-img">
          <Image src={shot.src} alt="" fill priority sizes="100vw" />
        </div>
      )}
      <div className="photo-hero-shade" />
      <div className="wrap photo-hero-inner">
        <div className="photo-hero-copy">
          <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
          <Reveal delay={0.06}><h1 className="h1 page-title">{title}</h1></Reveal>
          {lead && <Reveal delay={0.12}><p className="lead">{lead}</p></Reveal>}
          {children && <Reveal delay={0.18}><div className="page-hero-extra">{children}</div></Reveal>}
        </div>
        {aside && <Reveal delay={0.25} className="photo-hero-aside">{aside}</Reveal>}
      </div>
      {shot && <Link className="photo-hero-credit" href={shot.href}>{shot.caption}</Link>}
    </section>
  );
}
