import Image from "next/image";
import type { ReactNode } from "react";
import type { Shot } from "@/content/showcase";
import { Reveal } from "./Reveal";

// The forest band at the top of every inner page. With a photo of one of our homes behind it, under a forest wash so the text
// stays easy to read; the photo drifts very slowly, and stays still for anyone who has asked for less motion.
export function PageHero({ eyebrow, title, lead, photo, children }: { eyebrow: string; title: ReactNode; lead?: string; photo?: Shot | null; children?: ReactNode }) {
  return (
    <section className={`page-hero dark on-dark${photo ? " has-photo" : ""}`}>
      {photo && (
        <div className="page-hero-photo" aria-hidden>
          <Image src={photo.src} alt="" fill priority sizes="100vw" />
        </div>
      )}
      <div className="wrap">
        <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
        <Reveal delay={0.05}><h1 className="h1 page-title">{title}</h1></Reveal>
        {lead && <Reveal delay={0.1}><p className="lead">{lead}</p></Reveal>}
        {children && <Reveal delay={0.15}><div className="page-hero-extra">{children}</div></Reveal>}
      </div>
    </section>
  );
}
