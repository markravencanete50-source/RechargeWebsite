"use client";

import { useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

// A number that rolls to its new value when it changes, such as a results count.
export function RollingNumber({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 22 });
  const [shown, setShown] = useState(value);
  useEffect(() => { spring.set(value); }, [value, spring]);
  useMotionValueEvent(spring, "change", (v) => setShown(Math.round(v)));
  return <span className="rolling">{(reduce ? value : shown).toLocaleString("en-GB")}</span>;
}
