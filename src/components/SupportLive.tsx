"use client";

import { Check, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Line = { from: "guest" | "team"; text: string } | { from: "done"; text: string };
// Everyday problems, the way guests actually write them, and how the team answers. Shown as examples, not real conversations.
const SCENES: Line[][] = [
  [
    { from: "guest", text: "Hi, the heating will not come on and it is freezing in here." },
    { from: "team", text: "Sorry about that. Is there a red light on the boiler? If so, hold the reset button for five seconds." },
    { from: "guest", text: "That worked. Radiators warming up now, thank you!" },
    { from: "done", text: "Sorted in the chat" },
  ],
  [
    { from: "guest", text: "The key box code is not working and we are standing outside." },
    { from: "team", text: "We have just reset it. Your new code is in a text message now." },
    { from: "guest", text: "We are in. Thanks for being so quick." },
    { from: "done", text: "New code sent" },
  ],
  [
    { from: "guest", text: "Our flight lands at 1am. Can we still check in tonight?" },
    { from: "team", text: "Yes. The door code works all night, and someone is here if you need us." },
    { from: "done", text: "Late arrival noted" },
  ],
];

const ukTime = () => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" }).format(new Date());
const ukHour = () => Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "numeric", hourCycle: "h23" }).format(new Date()));

// The 24/7 promise as a moment, not a badge: the time in Scotland right now, the team on shift, and a conversation playing out.
export function SupportLive({ phone }: { phone: string }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const visible = useInView(box, { amount: 0.3 });
  const [time, setTime] = useState<string | null>(null);
  const [night, setNight] = useState(false);
  const [scene, setScene] = useState(0);
  const [shown, setShown] = useState(0);
  // With reduced motion, the first conversation is shown whole and still, once the page has loaded.
  const [mounted, setMounted] = useState(false);
  const still = mounted && !!reduce;
  const [typing, setTyping] = useState<"guest" | "team" | null>(null);

  // The clock, set after the page has loaded so the server and the browser agree.
  useEffect(() => {
    const tick = () => { setTime(ukTime()); const h = ukHour(); setNight(h < 7 || h >= 20); };
    queueMicrotask(() => { tick(); setMounted(true); });
    const t = setInterval(tick, 15_000);
    return () => clearInterval(t);
  }, []);

  // Plays one line at a time, with a typing pause before each message, then moves to the next conversation.
  useEffect(() => {
    if (!mounted || reduce || !visible) return;
    const lines = SCENES[scene];
    let t: ReturnType<typeof setTimeout>;
    if (shown < lines.length) {
      const next = lines[shown];
      if (next.from === "done") {
        t = setTimeout(() => setShown((n) => n + 1), 700);
      } else {
        queueMicrotask(() => setTyping(next.from as "guest" | "team"));
        t = setTimeout(() => { setTyping(null); setShown((n) => n + 1); }, shown === 0 ? 1100 : 900 + next.text.length * 18);
      }
    } else {
      t = setTimeout(() => { setShown(0); setScene((s) => (s + 1) % SCENES.length); }, 3600);
    }
    return () => clearTimeout(t);
  }, [scene, shown, visible, reduce, mounted]);

  const lines = still ? SCENES[0] : SCENES[scene].slice(0, shown);

  return (
    <div className="sl" ref={box}>
      <div className="sl-top">
        <div className="sl-time">
          <span className="sl-sky" aria-hidden>{night ? <Moon size={18} /> : <Sun size={18} />}</span>
          <div>
            <strong>{time ?? " "}</strong>
            <small>in Scotland right now</small>
          </div>
        </div>
        <span className="sl-status"><i aria-hidden /> Team on now</span>
      </div>

      <div className="sl-chat" aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          {lines.map((l, i) => (
            <motion.p key={`${scene}-${i}`} layout={!reduce} className={`sl-msg ${l.from}`}
              initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={{ type: "spring", stiffness: 380, damping: 30 }}>
              {l.from === "done" && <Check size={14} />}{l.text}
            </motion.p>
          ))}
          {typing && (
            <motion.span key={`typing-${scene}-${shown}`} layout={!reduce} className={`sl-typing ${typing}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
              <i /><i /><i />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <p className="sl-foot">Example conversations. Day or night, call <strong>{phone}</strong> and a person answers.</p>
    </div>
  );
}
