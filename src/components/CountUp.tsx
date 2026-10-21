"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// Counts a figure up from zero the first time it scrolls into view. The real figure is in the HTML,
// so search engines and reduced-motion visitors see it straight away.
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const m = value.match(/^(\d[\d,]*)(\D*)$/);

  useEffect(() => {
    if (!inView || reduce || !m || !ref.current) return;
    const target = Number(m[1].replace(/,/g, ""));
    const el = ref.current;
    const controls = animate(0, target, {
      duration: Math.min(2, 0.8 + target / 4000),
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => { el.textContent = Math.round(v).toLocaleString("en-GB") + m[2]; },
    });
    return () => controls.stop();
  }, [inView, reduce, m]);

  return <span ref={ref}>{value}</span>;
}
