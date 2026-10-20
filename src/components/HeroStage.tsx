"use client";

import { BellRing, Camera, PoundSterling } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";

const spring = { stiffness: 120, damping: 20, mass: 0.6 };

function Chip({ icon, title, text, style, delay, wide }: { icon: ReactNode; title: string; text: string; style: React.CSSProperties; delay: number; wide?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={wide ? "chip chip-wide" : "chip"}
      style={{ ...style, z: 90 }}
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.94 }}
      animate={reduce ? undefined : { opacity: 1, y: [0, -8, 0], scale: 1 }}
      transition={{ opacity: { delay, duration: 0.6 }, scale: { delay, duration: 0.6 }, y: { delay: delay + 0.6, duration: 5, repeat: Infinity, ease: "easeInOut" } }}
    >
      <span className="chip-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </motion.div>
  );
}

// Three real app screens standing in 3D. They tilt towards the pointer and drift as the page scrolls.
export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-26, -6]), spring);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [12, 0]), spring);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const spread = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const back = useTransform(spread, (v) => -v);

  return (
    <div
      ref={ref}
      className="stage"
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { px.set(0); py.set(0); }}
    >
      <motion.div
        className="stage-inner"
        style={reduce ? { transform: "rotateY(-16deg) rotateX(6deg)" } : { rotateY: rotY, rotateX: rotX, y: lift }}
        initial={reduce ? false : { opacity: 0, rotateY: -40, y: 60 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <motion.div style={{ position: "absolute", left: "2%", top: "14%", x: back, z: -120 }}>
          <PhoneFrame src="/app/cleaner.webp" alt="Recharge app: a cleaner's home screen" />
        </motion.div>
        <motion.div style={{ position: "absolute", right: "6%", top: "12%", x: spread, z: -80 }}>
          <PhoneFrame src="/app/ready.webp" alt="Recharge app: the maintenance team's home screen" />
        </motion.div>
        <div style={{ position: "absolute", left: "50%", top: "2%", transform: "translateX(-50%) translateZ(40px)" }}>
          <PhoneFrame src="/app/owner.webp" alt="Recharge app: a property owner's home screen" priority />
        </div>
        <Chip icon={<Camera size={18} />} title="Clean complete" text="12 photos uploaded" style={{ left: "-4%", bottom: "16%" }} delay={0.9} wide />
        <Chip icon={<PoundSterling size={18} />} title="Payout approved" text="Statement ready to view" style={{ right: "-2%", bottom: "30%" }} delay={1.2} />
        <Chip icon={<BellRing size={18} />} title="Repair booked" text="Engineer on the way" style={{ left: "6%", top: "6%" }} delay={1.5} wide />
      </motion.div>
    </div>
  );
}
