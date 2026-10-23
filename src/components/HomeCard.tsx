import Link from "next/link";
import { heading, money, tags, type Home } from "@/content/home-utils";
import { Photo } from "./Photo";

export function HomeCard({ home, priority }: { home: Home; priority?: boolean }) {
  const title = heading(home);
  const points = tags(home).slice(0, 2);
  const facts = [
    `${home.bedrooms} bed${home.bedrooms === 1 ? "" : "s"}`,
    home.guests ? `Sleeps ${home.guests}` : "",
    home.bathrooms ? `${home.bathrooms} bath${home.bathrooms === 1 ? "" : "s"}` : "",
  ].filter(Boolean);
  return (
    <Link className="home-card" href={`/properties/${home.slug}`}>
      <div className="home-photo">
        <Photo photo={home.photos[0]} alt={title} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 25vw" priority={priority} />
        {home.photos[1]?.src && (
          // A second photo fades in on hover, to give a feel for the home before opening it.
          <span className="home-photo-next" aria-hidden><Photo photo={home.photos[1]} alt="" sizes="(max-width: 980px) 50vw, 25vw" /></span>
        )}
        {(home.photoCount ?? home.photos.length) > 1 && <span className="home-count">{home.photoCount ?? home.photos.length} photos</span>}
      </div>
      <div className="home-body">
        <span className="home-area">{home.district}, {home.region}</span>
        <strong className="home-title">{title}</strong>
        <span className="home-facts">{facts.join(" · ")}</span>
        {points.length > 0 && <span className="home-tags">{points.join(" · ")}</span>}
        {home.price !== undefined && <span className="home-price">Around <strong>{money(home.price, home.currency)}</strong> a night</span>}
      </div>
    </Link>
  );
}
