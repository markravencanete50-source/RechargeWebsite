"use client";

import { Clock, ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Place } from "@/content/listing";
import { findPlacePhoto, wantsPhoto, type PlacePhoto } from "@/lib/place-photo";

export type { PlacePhoto };

// Undefined: still looking. Null: no real photo exists, so the place is listed without one.
type Found = Record<string, PlacePhoto | null | undefined>;

// A Google map of the area, with the nearby places beside it. Places with a real photograph
// (from Wikipedia, credited) get a photo card; the rest are listed plainly, never with a stand-in.
// Choosing a place moves the map to it. The map shows the town and postcode district only.
export function NearbyMap({ area, town, places, photos }: { area: string; town: string; places: Place[]; photos: Record<string, PlacePhoto | undefined> }) {
  const [focus, setFocus] = useState<string | null>(null);
  const [found, setFound] = useState<Found>(() => Object.fromEntries(places.map((p) => [p.name, photos[p.name] ?? (wantsPhoto(p.name) ? undefined : null)])));
  const query = focus ? `${focus}, ${area}` : area;
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${focus ? 14 : 13}&hl=en-GB&output=embed`;

  // Looks up any place the build did not, once per browser session.
  useEffect(() => {
    let live = true;
    for (const p of places) {
      if (found[p.name] !== undefined) continue;
      const key = `place-photo:${p.name}|${town}`;
      let cached: string | null = null;
      try { cached = sessionStorage.getItem(key); } catch {}
      const done = (v: PlacePhoto | null) => { if (live) setFound((f) => ({ ...f, [p.name]: v })); };
      if (cached !== null) { done(JSON.parse(cached)); continue; }
      findPlacePhoto(p.name, town)
        .then((v) => { try { sessionStorage.setItem(key, JSON.stringify(v)); } catch {} done(v); })
        .catch(() => done(null));
    }
    return () => { live = false; };
    // Runs once for this home's places; later results arrive through setFound.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withPhoto = places.filter((p) => found[p.name] !== null);
  const plain = places.filter((p) => found[p.name] === null);
  const select = (name: string) => setFocus((f) => (f === name ? null : name));

  return (
    <div className="nearby-map">
      <div className="map-frame">
        <iframe title={`Map of ${query}`} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
      <p className="map-note"><MapPin size={15} /> {area}. The exact address is sent after you book.</p>

      {withPhoto.length > 0 && (
        <div className="place-scroll" role="list">
          {withPhoto.map((p) => {
            const photo = found[p.name];
            const active = focus === p.name;
            return (
              <div role="listitem" key={p.name + p.time} className={`place-card${active ? " active" : ""}`}>
                <button type="button" onClick={() => select(p.name)} aria-pressed={active} aria-label={`Show ${p.name} on the map`}>
                  <span className={`place-photo${photo ? "" : " loading"}`}>
                    {photo && <Image src={photo.src} alt={p.name} fill sizes="240px" />}
                  </span>
                  <strong>{p.name}</strong>
                  {p.time && <em><Clock size={13} /> {p.time}</em>}
                </button>
                {photo?.credit && <a className="place-credit" href={photo.page} target="_blank" rel="noopener">Photo: {photo.credit}</a>}
              </div>
            );
          })}
        </div>
      )}

      {plain.length > 0 && (
        <ul className="place-rows">
          {plain.map((p) => (
            <li key={p.name + p.time} className={focus === p.name ? "active" : undefined}>
              <button type="button" onClick={() => select(p.name)} aria-pressed={focus === p.name}>
                <MapPin size={16} />
                <strong>{p.name}</strong>
                {p.time && <em>{p.time}</em>}
              </button>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${area}`)}`} target="_blank" rel="noopener" aria-label={`Open ${p.name} in Google Maps`}><ExternalLink size={15} /></a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
