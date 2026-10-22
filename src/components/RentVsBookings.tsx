"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

// An illustration of the idea, not real figures: bookings rise and fall with the seasons, a guaranteed rent does not.
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const SHAPE = [44, 50, 60, 72, 82, 93, 100, 97, 80, 66, 52, 47];
const RENT = 72;

export function RentVsBookings() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const show = seen || !!reduce;
  const t = (i: number) => ({ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.08 * i, ease: [0.2, 0.7, 0.2, 1] as const });

  return (
    <figure className="gr-chart" ref={ref}>
      <figcaption className="gr-chart-head">
        <strong>One year, month by month</strong>
        <span>An illustration, not real figures</span>
      </figcaption>
      <div className="gr-chart-plot" role="img" aria-label="Illustration: income from bookings rises and falls through the year, while guaranteed rent is the same every month.">
        <div className="gr-bars" aria-hidden>
          {SHAPE.map((v, i) => (
            <div key={i} className="gr-col">
              <motion.i className={v < RENT ? "low" : ""} style={{ height: `${v}%`, transformOrigin: "bottom" }} initial={{ scaleY: 0 }} animate={{ scaleY: show ? 1 : 0 }} transition={t(i)} />
              <span>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
        <motion.div className="gr-line" aria-hidden style={{ bottom: `calc(${RENT}% * 0.86 + 24px)`, transformOrigin: "left" }} initial={{ scaleX: 0 }} animate={{ scaleX: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.5, ease: [0.2, 0.7, 0.2, 1] }}>
          <b>Your guaranteed rent</b>
        </motion.div>
      </div>
      <ul className="gr-legend">
        <li><i className="bar" /> Income from bookings: it changes with the season</li>
        <li><i className="rule" /> Guaranteed rent: the same every month</li>
      </ul>
    </figure>
  );
}
