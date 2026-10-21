"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo as PhotoType } from "@/content/properties";
import { Photo } from "./Photo";

// The first five photos in a grid on larger screens, a swipeable strip on a phone;
// every photo full screen, with arrow keys and swipe.
export function Gallery({ photos, title }: { photos: PhotoType[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const real = photos.filter((p) => p.src);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + real.length) % real.length)), [real.length]);

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, step]);

  const cells = [0, 1, 2, 3, 4].map((i) => photos[i]);
  return (
    <>
      {real.length > 0 && (
        <div className="gallery-swipe">
          <div className="gallery-track" onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
            {real.map((p, i) => (
              <button key={p.src} type="button" className="gallery-slide" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${real.length}`}>
                <Image src={p.src!} alt={`${title}, photo ${i + 1}`} fill sizes="100vw" priority={i === 0} loading={i === 0 ? undefined : "lazy"} />
              </button>
            ))}
          </div>
          <span className="gallery-count">{slide + 1} / {real.length}</span>
        </div>
      )}
      <div className={`gallery${real.length > 0 ? " has-swipe" : ""}`}>
        {cells.map((p, i) => (
          <button key={i} type="button" className="gallery-cell" onClick={() => p?.src && setOpen(i)} aria-label={p?.src ? `Open photo ${i + 1} of ${real.length}` : undefined} disabled={!p?.src}>
            <Photo photo={p} alt={`${title}, photo ${i + 1}`} sizes={i === 0 ? "(max-width: 900px) 100vw, 50vw" : "25vw"} priority={i === 0} />
          </button>
        ))}
        {real.length > 5 && (
          <button type="button" className="gallery-all" onClick={() => setOpen(0)}><Images size={18} /> Show all {real.length} photos</button>
        )}
      </div>
      {open !== null && real[open] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} photos`}>
          <button type="button" className="lightbox-close" onClick={() => setOpen(null)} aria-label="Close photos" autoFocus><X size={22} /></button>
          <button type="button" className="lightbox-nav prev" onClick={() => step(-1)} aria-label="Previous photo"><ChevronLeft size={26} /></button>
          <figure>
            <div className="lightbox-img"><Image src={real[open].src!} alt={real[open].alt} fill sizes="100vw" /></div>
            <figcaption>{open + 1} / {real.length}{real[open].alt && real[open].alt !== title ? `  ${real[open].alt}` : ""}</figcaption>
          </figure>
          <button type="button" className="lightbox-nav next" onClick={() => step(1)} aria-label="Next photo"><ChevronRight size={26} /></button>
        </div>
      )}
    </>
  );
}
