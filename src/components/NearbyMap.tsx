"use client";

import { Clock, ExternalLink, Landmark, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Place } from "@/content/listing";

export type PlacePhoto = { src: string; page: string; credit?: string };

// A Google map of the area, with the nearby places as photo cards. Choosing a card moves the map to
// that place. The map centres on the town and postcode district only: the address is sent after booking.
export function NearbyMap({ area, places, photos }: { area: string; places: Place[]; photos: Record<string, PlacePhoto | undefined> }) {
  const [focus, setFocus] = useState<string | null>(null);
  const query = focus ? `${focus}, ${area}` : area;
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${focus ? 14 : 13}&hl=en-GB&output=embed`;

  return (
    <div className="nearby-map">
      <div className="map-frame">
        <iframe title={`Map of ${query}`} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
      <p className="map-note"><MapPin size={15} /> {area}. The exact address is sent after you book.</p>
      {places.length > 0 && (
        <div className="place-scroll" role="list">
          {places.map((p) => {
            const photo = photos[p.name];
            const active = focus === p.name;
            return (
              <div role="listitem" key={p.name + p.time} className={`place-card${active ? " active" : ""}`}>
                <button type="button" onClick={() => setFocus(active ? null : p.name)} aria-pressed={active} aria-label={`Show ${p.name} on the map`}>
                  <span className="place-photo">
                    {photo ? <Image src={photo.src} alt={p.name} fill sizes="240px" /> : <Landmark size={28} />}
                  </span>
                  <strong>{p.name}</strong>
                  {p.time && <em><Clock size={13} /> {p.time}</em>}
                </button>
                <a className="place-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${area}`)}`} target="_blank" rel="noopener">
                  Open in Google Maps <ExternalLink size={13} />
                </a>
                {photo?.credit && <a className="place-credit" href={photo.page} target="_blank" rel="noopener">Photo: {photo.credit}</a>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
