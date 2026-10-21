import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Shot } from "@/content/showcase";
import { Reveal } from "./Reveal";

export type Trip = { title: string; text: string; href: string; cta: string; shot: Shot | null };

// One large photo and three smaller ones, each a way into the search.
export function TripGrid({ trips }: { trips: Trip[] }) {
  return (
    <div className="trip-grid">
      {trips.map((t, i) => (
        <Reveal key={t.title} delay={i * 0.08} className={`trip trip-${i}`}>
          <Link href={t.href}>
            {t.shot && <Image src={t.shot.src} alt={t.shot.caption} fill sizes={i === 0 ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 100vw, 30vw"} />}
            <span className="trip-shade" />
            <span className="trip-copy">
              <strong>{t.title}</strong>
              <span>{t.text}</span>
              <em>{t.cta} <ArrowRight size={16} /></em>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
