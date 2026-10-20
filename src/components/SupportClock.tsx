"use client";

import { motion, useReducedMotion } from "motion/react";

// A 24-hour dial with a sweeping hand: support never clocks off.
export function SupportClock() {
  const reduce = useReducedMotion();
  const ticks = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="clock" aria-hidden="true">
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a7d9c1" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a7d9c1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a7d9c1" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a7d9c1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="196" fill="url(#glow)" />
        <circle cx="200" cy="200" r="160" fill="none" stroke="#efe9db" strokeOpacity="0.16" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="#efe9db" strokeOpacity="0.1" strokeWidth="1.5" />
        {ticks.map((i) => {
          const a = (i / 24) * Math.PI * 2;
          const major = i % 6 === 0;
          const r1 = major ? 140 : 148;
          return (
            <line key={i} x1={200 + Math.sin(a) * r1} y1={200 - Math.cos(a) * r1} x2={200 + Math.sin(a) * 158} y2={200 - Math.cos(a) * 158}
              stroke={major ? "#a7d9c1" : "#efe9db"} strokeOpacity={major ? 1 : 0.35} strokeWidth={major ? 3 : 1.5} strokeLinecap="round" />
          );
        })}
        <motion.g
          style={{ transformOrigin: "200px 200px", transformBox: "view-box" }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <path d="M200 200 L200 40 A160 160 0 0 1 338.6 120 Z" fill="url(#sweep)" />
          <line x1="200" y1="200" x2="200" y2="40" stroke="#a7d9c1" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
        <circle cx="200" cy="200" r="78" fill="#12302a" stroke="#a7d9c1" strokeOpacity="0.4" />
        <text x="200" y="208" textAnchor="middle" fill="#efe9db" fontSize="46" fontWeight="600" fontFamily="var(--font-montserrat)" letterSpacing="-1">24/7</text>
        <text x="200" y="236" textAnchor="middle" fill="#a7d9c1" fontSize="12" fontWeight="600" fontFamily="var(--font-montserrat)" letterSpacing="2.5">SUPPORT</text>
      </svg>
    </div>
  );
}
