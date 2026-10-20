import { Check } from "lucide-react";
import { ep } from "../anim";
import { C, FONT } from "../theme";
import { CUT, L } from "../timeline";

/* The four steps of a stay, top left, while the process is shown. The current step is filled. */
const STEPS = [
  { label: "Book", from: L.book.start },
  { label: "Clean", from: L.clean.start },
  { label: "Fix", from: L.fix.start },
  { label: "Paid", from: L.owners.start },
];
const SHOW = [L.book.start - 0.1, CUT.support] as const;

export function StepTracker({ t }: { t: number }) {
  if (t < SHOW[0] - 0.1 || t > SHOW[1] + 0.4) return null;
  const vis = ep(t, SHOW[0], SHOW[0] + 0.4) * (1 - ep(t, SHOW[1] - 0.2, SHOW[1] + 0.2));
  const cur = STEPS.reduce((k, s, i) => (t >= s.from ? i : k), 0);
  return (
    <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 8, padding: 8, borderRadius: 999, background: "rgba(11,31,26,.85)", boxShadow: "0 10px 30px rgba(0,0,0,.25)", opacity: vis, transform: `translateY(${(1 - vis) * -20}px)`, zIndex: 90 }}>
      {STEPS.map((s, i) => {
        const on = i === cur, done = i < cur;
        const p = ep(t, s.from, s.from + 0.3);
        return (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px 9px 9px", borderRadius: 999, background: on ? `rgba(167,217,193,${0.25 + 0.75 * p})` : "transparent", color: on ? C.deep : done ? C.white : C.onDarkMuted, font: `600 22px ${FONT}` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: on ? C.deep : done ? C.mint : "rgba(255,255,255,.12)", font: `700 18px ${FONT}` }}>
              {done ? <Check size={20} color={C.deep} strokeWidth={3.2} /> : <span style={{ color: on ? C.white : C.onDarkMuted }}>{i + 1}</span>}
            </div>
            {s.label}
          </div>
        );
      })}
    </div>
  );
}
