"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Fades and lifts content into place the first time it scrolls into view. It starts a little before the content reaches the
// screen and is quick, so a fast scroll on a phone never lands on empty space waiting to fill in.
export function Reveal({ children, delay = 0, y = 16, className, id, as = "div" }: { children: ReactNode; delay?: number; y?: number; className?: string; id?: string; as?: "div" | "li" | "section" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      id={id}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px 15% 0px" }}
      transition={{ duration: 0.55, delay: Math.min(delay, 0.2), ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Tag>
  );
}
