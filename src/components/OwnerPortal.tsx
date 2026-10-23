"use client";

import { BadgeCheck, CalendarCheck, FileText, Mail, Rocket, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { PhoneFrame } from "./PhoneFrame";

// What an owner sees in the Recharge client portal, and nothing they do not.
const features: { icon: LucideIcon; title: string; text: string; note: string }[] = [
  { icon: CalendarCheck, title: "Bookings and performance", text: "Your calendar, every booking and how each property is doing, on one screen.", note: "New booking added to your calendar" },
  { icon: FileText, title: "Statements and payouts", text: "Monthly statements from cleared funds, with every cost listed.", note: "Your statement is ready" },
  { icon: BadgeCheck, title: "Approvals", text: "Approve repair and furnishing quotes with a tap, then see the photos when the work is done.", note: "A repair quote is waiting for you" },
  { icon: Rocket, title: "Onboarding", text: "Follow a new property from enquiry to first guest, step by step.", note: "Inspection complete" },
  { icon: Mail, title: "Your post", text: "Letters that arrive at the property are photographed during a clean.", note: "New post photographed" },
];

export function OwnerPortal() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 110, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 110, damping: 18 });

  // Walks through the features on its own until the visitor picks one.
  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % features.length), 3800);
    return () => clearInterval(t);
  }, [reduce, paused]);

  const f = features[active];
  return (
    <div className="portal">
      <ol className="portal-list">
        {features.map((x, i) => (
          <li key={x.title}>
            <button type="button" aria-pressed={i === active} onClick={() => { setActive(i); setPaused(true); }} className={i === active ? "on" : undefined}>
              <span className="portal-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="portal-text">
                <strong>{x.title}</strong>
                <span>{x.text}</span>
              </span>
              {i === active && !paused && !reduce && <motion.span className="portal-progress" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.8, ease: "linear" }} />}
            </button>
          </li>
        ))}
      </ol>
      <div
        className="portal-stage"
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => { px.set(0); py.set(0); }}
      >
        <span className="portal-ring" aria-hidden />
        <motion.div style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }}>
          <PhoneFrame src="/app/owner.webp" alt="The Recharge owner app: properties, approvals, messages and earnings" />
        </motion.div>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={f.title}
            className="portal-note"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -18, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <span className="row-ic"><f.icon size={18} /></span>
            <span><strong>Recharge</strong>{f.note}</span>
          </motion.div>
        </AnimatePresence>
        <p className="portal-caption">The owner screen from the Recharge app, shown with sample data.</p>
      </div>
    </div>
  );
}
