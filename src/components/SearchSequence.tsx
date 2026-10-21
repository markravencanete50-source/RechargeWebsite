"use client";

import { CheckCircle2, MapPin } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

const ease = [0.2, 0.7, 0.2, 1] as const;
const SEARCH_MS = 750;

// The moment between pressing Search and seeing homes. Remounted (by key) for every new search:
// a pulsing pin and shimmering placeholder cards while it "looks", then a found message, then
// the results. Skipped entirely under reduced motion.
export function SearchSequence({ place, count, children }: { place: string; count: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  const [searching, setSearching] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSearching(false), SEARCH_MS);
    return () => clearTimeout(t);
  }, []);

  if (reduce) return <>{children}</>;

  return (
    <>
      <div className="search-status" role="status" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {searching ? (
            <motion.div key="looking" className="search-status-in" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25, ease }}>
              <span className="pin-pulse"><MapPin size={18} /><i /><i /></span>
              <span>Searching homes {place}</span>
              <span className="search-status-bar"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: SEARCH_MS / 1000, ease: "easeInOut" }} /></span>
            </motion.div>
          ) : (
            <motion.div key="found" className="search-status-in found" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
              <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 420, damping: 18 }} style={{ display: "inline-flex" }}><CheckCircle2 size={18} /></motion.span>
              <span>{count ? `${count} ${count === 1 ? "home" : "homes"} found ${place}` : `No homes found ${place}`}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {searching ? (
        <div className="homes" aria-hidden>
          {Array.from({ length: Math.max(4, Math.min(count || 4, 8)) }, (_, i) => (
            <motion.div key={i} className="ghost-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease }}>
              <span className="ghost-photo" />
              <span className="ghost-line w60" />
              <span className="ghost-line w85" />
              <span className="ghost-line w40" />
            </motion.div>
          ))}
        </div>
      ) : (
        children
      )}
    </>
  );
}

// Each home after a search: rises into place and its photo wipes into view. No blur: blurring a whole card is slow on phones.
export function RevealCard({ index, children }: { index: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="reveal-card"
      style={{ ["--d" as string]: `${Math.min(index, 7) * 0.06}s` }}
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease, delay: Math.min(index, 7) * 0.06 }}
    >
      {children}
    </motion.div>
  );
}
