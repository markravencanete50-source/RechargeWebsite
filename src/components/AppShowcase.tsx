"use client";

import { BadgeCheck, CalendarCheck, Camera, ClipboardCheck, FileText, Hammer, Inbox, LayoutGrid, MessageSquareText, ShieldCheck, Wrench, Zap } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";

type View = { id: string; label: string; screen: string; alt: string; points: { icon: ReactNode; title: string; text: string }[] };

const views: View[] = [
  {
    id: "owners", label: "Owners", screen: "/app/owner.webp", alt: "Recharge app: owner home with properties, approvals, messages and earnings",
    points: [
      { icon: <LayoutGrid size={20} />, title: "Your portfolio", text: "Every property and how it is performing, on one screen." },
      { icon: <FileText size={20} />, title: "Statements and payouts", text: "What was earned, what was spent and what is being paid out." },
      { icon: <BadgeCheck size={20} />, title: "Approvals", text: "Approve repair quotes from your phone in a tap." },
    ],
  },
  {
    id: "guests", label: "Guest support", screen: "/app/stays.webp", alt: "Recharge app: the stays team home with the guest inbox",
    points: [
      { icon: <Inbox size={20} />, title: "One guest inbox", text: "Every conversation in one place, with the guest's stay and history." },
      { icon: <Zap size={20} />, title: "Quick, consistent replies", text: "Saved replies answer common questions in seconds." },
      { icon: <MessageSquareText size={20} />, title: "Issues followed up", text: "A guest problem becomes a job with an owner and a status." },
    ],
  },
  {
    id: "cleaners", label: "Cleaners", screen: "/app/cleaner.webp", alt: "Recharge app: a cleaner's home with the clean calendar",
    points: [
      { icon: <CalendarCheck size={20} />, title: "Schedule from bookings", text: "Cleans are created from each booking and assigned automatically." },
      { icon: <ClipboardCheck size={20} />, title: "A checklist per home", text: "Every room ticked off on the phone, to the same standard." },
      { icon: <Camera size={20} />, title: "Photo proof", text: "Photos upload even on a weak signal and finish when it returns." },
    ],
  },
  {
    id: "maintenance", label: "Maintenance", screen: "/app/ready.webp", alt: "Recharge app: the maintenance team home with repairs and inspections",
    points: [
      { icon: <Wrench size={20} />, title: "Every repair tracked", text: "Reported by a guest, cleaner or owner, each one gets an owner and a status." },
      { icon: <ShieldCheck size={20} />, title: "Safety checks on schedule", text: "Smoke and CO alarms, fire blankets and key safes checked per home." },
      { icon: <Hammer size={20} />, title: "Contractors managed", text: "Jobs referred, followed and costed through to the end." },
    ],
  },
];

export function AppShowcase() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-18, 18]), { stiffness: 110, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 110, damping: 18 });
  const view = views[active];

  return (
    <div className="showcase">
      <div>
        <div className="tabs" role="tablist" aria-label="Who uses the app">
          {views.map((v, i) => (
            <button
              key={v.id}
              role="tab"
              id={`${uid}-tab-${v.id}`}
              aria-selected={i === active}
              aria-controls={`${uid}-panel`}
              tabIndex={i === active ? 0 : -1}
              className="tab"
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                const next = (active + (e.key === "ArrowRight" ? 1 : views.length - 1)) % views.length;
                setActive(next);
                document.getElementById(`${uid}-tab-${views[next].id}`)?.focus();
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${view.id}`}>
          <AnimatePresence mode="wait">
            <motion.ul
              key={view.id}
              className="benefits"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {view.points.map((p) => (
                <li key={p.title}>
                  <span className="ic">{p.icon}</span>
                  <div><strong>{p.title}</strong><p>{p.text}</p></div>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 20 }}>Screens from the Recharge app, shown with sample data.</p>
      </div>
      <div
        className="showcase-stage"
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => { px.set(0); py.set(0); }}
      >
        <motion.div style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view.id}
              initial={reduce ? false : { rotateY: -70, opacity: 0, scale: 0.92 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { rotateY: 70, opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <PhoneFrame src={view.screen} alt={view.alt} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
