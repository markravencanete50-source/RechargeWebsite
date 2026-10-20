"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// The "why we are different" film. Plays muted when it scrolls into view, pauses when it leaves.
export function DiffVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.4 });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className="video-frame">
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/recharge-different-poster.jpg"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="Film: Recharge connects owners, guests, cleaners and maintenance in one app, with 24/7 support"
      >
        <source src="/video/recharge-different.mp4" type="video/mp4" />
      </video>
      <div className="video-controls">
        <button
          type="button"
          aria-label={playing ? "Pause film" : "Play film"}
          onClick={() => (ref.current?.paused ? ref.current.play() : ref.current?.pause())}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
    </div>
  );
}
