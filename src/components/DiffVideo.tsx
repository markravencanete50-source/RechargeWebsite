"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// The "why we are different" film. Plays muted when it scrolls into view, pauses when it leaves.
// Browsers only autoplay without sound, so the music is one tap away on the sound button.
export function DiffVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

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
          className="video-sound"
          aria-pressed={!muted}
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
            if (!v.muted && v.paused) v.play().catch(() => {});
          }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span>{muted ? "Sound on" : "Sound off"}</span>
        </button>
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
