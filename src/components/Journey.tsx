"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { journey } from "@/content/tools";

// One booking followed through the app. The line fills as you scroll down the steps.
export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol className="journey" ref={ref}>
      <span className="journey-rail" aria-hidden><motion.span className="journey-fill" style={{ scaleY: reduce ? 1 : fill }} /></span>
      {journey.map((s, i) => (
        <motion.li
          key={s.title}
          className="journey-step"
          initial={reduce ? false : { opacity: 0.25, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -30% 0px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <span className="journey-num">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <strong>{s.title}</strong>
            <p>{s.text}</p>
            <span className="journey-tool">{s.tool}</span>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
