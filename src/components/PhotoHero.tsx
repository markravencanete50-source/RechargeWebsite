import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Shot } from "@/content/showcase";
import { Reveal } from "./Reveal";

// A full-bleed hero on a real Recharge home, with a slow push-in on the photo.
// With several shots it crossfades between them.
export function PhotoHero({ shot, shots, eyebrow, title, lead, children, aside, className = "" }: { shot?: Shot | null; shots?: (Shot | null)[]; eyebrow: string; title: ReactNode; lead?: string; children?: ReactNode; aside?: ReactNode; className?: string }) {
  const set = (shots ?? [shot]).filter((s): s is Shot => !!s);
  return (
    <section className={`photo-hero on-dark ${set.length > 1 ? "is-cycling" : ""} ${className}`}>
      {set.map((s, i) => (
        <div className="photo-hero-img" key={s.src} style={{ animationDelay: `${i * 7}s` }}>
          <Image src={s.src} alt="" fill priority={i === 0} sizes="100vw" />
        </div>
      ))}
      <div className="photo-hero-shade" />
      <div className={`wrap photo-hero-inner${aside ? "" : " solo"}`}>
        <div className="photo-hero-copy">
          <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
          <Reveal delay={0.06}><h1 className="h1 page-title">{title}</h1></Reveal>
          {lead && <Reveal delay={0.12}><p className="lead">{lead}</p></Reveal>}
          {children && <Reveal delay={0.18}><div className="page-hero-extra">{children}</div></Reveal>}
        </div>
        {aside && <Reveal delay={0.25} className="photo-hero-aside">{aside}</Reveal>}
      </div>
      {set.length === 1 && <Link className="photo-hero-credit" href={set[0].href}>{set[0].caption}</Link>}
    </section>
  );
}
