"use client";

import { motion, useReducedMotion } from "motion/react";

// The line that draws itself between the step cards.
export function StepsLine() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="steps-line"
      aria-hidden
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
    />
  );
}
