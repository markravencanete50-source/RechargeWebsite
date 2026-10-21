import { Bath, BedDouble, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { heading, money, tags, type Home } from "@/content/properties";
import { AmenityIcon } from "./Amenity";
import { Photo } from "./Photo";

export function HomeCard({ home, priority }: { home: Home; priority?: boolean }) {
  const top = home.amenities.slice(0, 3);
  const title = heading(home);
  const points = tags(home).slice(0, 2);
  return (
    <Link className="home-card" href={`/properties/${home.slug}`}>
      <div className="home-photo">
        <Photo photo={home.photos[0]} alt={title} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 25vw" priority={priority} />
        {home.photos.length > 1 && <span className="home-count">{home.photos.length} photos</span>}
      </div>
      <div className="home-body">
        <span className="home-area"><MapPin size={15} /> {home.district}, {home.region}</span>
        <strong className="home-title">{title}</strong>
        {points.length > 0 && <div className="home-tags">{points.map((p) => <span key={p}>{p}</span>)}</div>}
        <div className="home-facts">
          <span><BedDouble size={15} /> {home.bedrooms} bed{home.bedrooms === 1 ? "" : "s"}</span>
          {home.guests && <span><Users size={15} /> Sleeps {home.guests}</span>}
          {home.bathrooms && <span><Bath size={15} /> {home.bathrooms} bath</span>}
        </div>
        {home.price !== undefined && <span className="home-price">Around <strong>{money(home.price, home.currency)}</strong> a night</span>}
        {top.length > 0 && (
          <div className="home-amenities">
            {top.map((a) => <span key={a}><AmenityIcon name={a} size={14} /> {a}</span>)}
          </div>
        )}
      </div>
    </Link>
  );
}
