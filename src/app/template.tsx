"use client";

import { motion, useReducedMotion } from "motion/react";

// Each page fades in as you arrive. Opacity only: a transform here would break fixed elements
// such as the booking bar and the photo viewer.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}
