"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";

const screens = [
  { src: "/app/stays.webp", alt: "Recharge app: the guest support inbox", label: "Guest support" },
  { src: "/app/owner.webp", alt: "Recharge app: the owner home screen", label: "Owners" },
  { src: "/app/cleaner.webp", alt: "Recharge app: a cleaner's calendar", label: "Cleaners" },
];

// The app page hero: three real app screens fanned out in 3D, leaning towards the pointer.
export function AppHero({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 90, damping: 20 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 90, damping: 20 });

  return (
    <section
      className="app-hero dark on-dark"
      onPointerMove={(e) => {
        if (reduce) return;
        px.set(e.clientX / window.innerWidth - 0.5);
        py.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <div className="hero-motion" aria-hidden>
        <span className="glow g1" /><span className="glow g2" />
      </div>
      <div className="wrap app-hero-inner">
        <div className="app-hero-copy">{children}</div>
        <motion.div className="fan" style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }}>
          {screens.map((s, i) => (
            <motion.div
              key={s.src}
              className={`fan-phone f${i}`}
              initial={reduce ? false : { opacity: 0, y: 80, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: [-9, 0, 9][i] }}
              transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.25 + [0.2, 0, 0.35][i] }}
            >
              <PhoneFrame src={s.src} alt={s.alt} priority={i === 1} />
              <span className="fan-label">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
