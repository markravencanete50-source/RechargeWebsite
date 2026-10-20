import { ArrowUpRight, BedDouble, MapPin, Users } from "lucide-react";
import Link from "next/link";
import type { Home } from "@/content/photos";
import { Photo } from "./Photo";

export function HomeCard({ home, priority }: { home: Home; priority?: boolean }) {
  return (
    <Link className="home-card" href={`/properties/${home.slug}`}>
      <div className="home-photo">
        <Photo photo={home.photos[0]} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 25vw" priority={priority} />
        <span className="home-open"><ArrowUpRight size={18} /></span>
      </div>
      <div className="home-meta">
        <strong>{home.name}</strong>
        <span className="home-area"><MapPin size={15} /> {home.area}</span>
      </div>
      {(home.sleeps || home.bedrooms) && (
        <div className="home-facts">
          {home.sleeps && <span><Users size={15} /> Sleeps {home.sleeps}</span>}
          {home.bedrooms && <span><BedDouble size={15} /> {home.bedrooms} bedroom{home.bedrooms > 1 ? "s" : ""}</span>}
        </div>
      )}
    </Link>
  );
}
