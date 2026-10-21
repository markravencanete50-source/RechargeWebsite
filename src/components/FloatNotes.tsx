"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Small app-style notes that pop in over a photo, one after another, then drift gently.
export function FloatNotes({ notes }: { notes: { icon: ReactNode; text: string }[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="float-notes" aria-hidden>
      {notes.map((n, i) => (
        <motion.div
          key={n.text}
          className={`float-note n${i}`}
          initial={reduce ? false : { opacity: 0, y: 26, scale: 0.85 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.4 + i * 0.45 }}
        >
          <span className="row-ic">{n.icon}</span>{n.text}
        </motion.div>
      ))}
    </div>
  );
}
