import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Shot } from "@/content/showcase";
import type { Reason } from "@/content/why";
import { Reveal } from "./Reveal";

// Reasons as an editorial list: icon, short title, one line. Used side by side on the homepage.
export function ReasonList({ items, columns = 1 }: { items: Reason[]; columns?: 1 | 2 }) {
  return (
    <ul className={`reasons${columns === 2 ? " two" : ""}`}>
      {items.map((r, i) => (
        <Reveal as="li" key={r.title} delay={i * 0.06} className="reason">
          <span className="row-ic"><r.icon size={20} /></span>
          <div><strong>{r.title}</strong><p>{r.text}</p></div>
        </Reveal>
      ))}
    </ul>
  );
}

export function WhyChoose({ owners, guests, ownerShot, guestShot }: { owners: Reason[]; guests: Reason[]; ownerShot?: Shot | null; guestShot?: Shot | null }) {
  return (
    <div className="why">
      <div className="why-col">
        {ownerShot && <Reveal className="why-photo"><Image src={ownerShot.src} alt={ownerShot.caption} fill sizes="(max-width: 900px) 100vw, 50vw" /></Reveal>}
        <Reveal className="why-head">
          <p className="eyebrow">For owners</p>
          <h3 className="h2">Why owners choose Recharge</h3>
        </Reveal>
        <ReasonList items={owners} />
        <Link className="btn btn-primary" href="/owners">Let us run your property <ArrowRight size={18} /></Link>
      </div>
      <div className="why-col guests on-dark">
        {guestShot && <Reveal className="why-photo"><Image src={guestShot.src} alt={guestShot.caption} fill sizes="(max-width: 900px) 100vw, 50vw" /></Reveal>}
        <Reveal className="why-head">
          <p className="eyebrow">For guests</p>
          <h3 className="h2">Why guests choose Recharge</h3>
        </Reveal>
        <ReasonList items={guests} />
        <Link className="btn btn-mint" href="/properties">Find your stay <ArrowRight size={18} /></Link>
      </div>
    </div>
  );
}
