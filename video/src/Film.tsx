import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// "Why Recharge is different": one app for owners, guests, cleaners and maintenance, with 24/7 support.
// 1920 x 1080, 30 fps. Brand colours from the Recharge app.

export const FPS = 30;
const C = { cream: "#EFE9DB", paper: "#FCFAF5", forest: "#1B3E38", deep: "#12302A", ink: "#152D28", mint: "#A7D9C1", muted: "#4E6259" };
const font = "Montserrat, sans-serif";
const ease = Easing.bezier(0.2, 0.7, 0.2, 1);

const fade = (f: number, start: number, len = 18) => interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const out = (f: number, start: number, len = 14) => interpolate(f, [start, start + len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const SCENES = { hook: 120, logo: 110, role: 150, support: 130, end: 120 } as const;
export const ROLES = [
  { name: "Owners", line: "See bookings, statements and payouts. Approve costs in a tap.", screen: "app/owner.webp", chip: ["Payout approved", "Statement ready to view"] },
  { name: "Guests", line: "Every message answered, day and night.", screen: "app/stays.webp", chip: ["Guest message", "Reply sent"] },
  { name: "Cleaners", line: "Schedules from bookings. Checklists and photo proof.", screen: "app/cleaner.webp", chip: ["Clean complete", "12 photos uploaded"] },
  { name: "Maintenance", line: "Repairs logged, tracked and closed.", screen: "app/ready.webp", chip: ["Repair booked", "Engineer on the way"] },
] as const;
export const DURATION = SCENES.hook + SCENES.logo + SCENES.role * ROLES.length + SCENES.support + SCENES.end;

function Words({ text, start, size, color, weight = 600, stagger = 4, style }: { text: string; start: number; size: number; color: string; weight?: number; stagger?: number; style?: CSSProperties }) {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, fontFamily: font, fontSize: size, fontWeight: weight, letterSpacing: "-0.03em", lineHeight: 1.08, color, ...style }}>
      {text.split(" ").map((w, i) => {
        const p = fade(f, start + i * stagger, 20);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
}

function Orbits({ color, opacity = 0.14 }: { color: string; opacity?: number }) {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {[1500, 1100, 760].map((d, i) => (
        <div key={d} style={{ position: "absolute", width: d, height: d, borderRadius: "50%", border: `2px solid ${color}`, opacity, transform: `rotate(${f * (i % 2 ? -0.2 : 0.15)}deg)` }}>
          <div style={{ position: "absolute", top: -7, left: "50%", width: 12, height: 12, borderRadius: "50%", background: color }} />
        </div>
      ))}
    </AbsoluteFill>
  );
}

// Scene 1: the problem.
function Hook() {
  const f = useCurrentFrame();
  const leave = out(f, SCENES.hook - 18, 18);
  return (
    <AbsoluteFill style={{ background: C.cream, justifyContent: "center", padding: "0 220px", opacity: leave }}>
      <div style={{ fontFamily: font, fontSize: 26, fontWeight: 600, letterSpacing: "0.16em", color: "#315F50", marginBottom: 36, opacity: fade(f, 0) }}>SHORT-LET MANAGEMENT IN SCOTLAND</div>
      <Words text="Most property managers stop at the keys." start={8} size={112} color={C.ink} />
      <div style={{ marginTop: 40, opacity: fade(f, 52) }}>
        <Words text="Then it is calls, chasers and spreadsheets." start={52} size={46} weight={500} color={C.muted} stagger={3} />
      </div>
    </AbsoluteFill>
  );
}

// Scene 2: the brand.
function Logo() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = interpolate(f, [0, 26], [0, 140], { extrapolateRight: "clamp", easing: ease });
  const s = spring({ frame: f - 14, fps, config: { damping: 16 } });
  const leave = out(f, SCENES.logo - 14);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <AbsoluteFill style={{ background: C.forest, clipPath: `circle(${r}% at 50% 50%)`, alignItems: "center", justifyContent: "center", opacity: leave }}>
        <Orbits color={C.mint} opacity={0.12} />
        <div style={{ clipPath: `inset(0 ${(1 - fade(f, 18, 30)) * 100}% 0 0)`, transform: `scale(${0.92 + s * 0.08})` }}>
          <Img src={staticFile("brand/recharge-logo-cream.png")} style={{ width: 980 }} />
        </div>
        <div style={{ marginTop: 64, opacity: fade(f, 46) }}>
          <Words text="We built one app that runs everything." start={46} size={56} weight={500} color={C.cream} stagger={3} style={{ justifyContent: "center" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function Phone({ src, style }: { src: string; style?: CSSProperties }) {
  return (
    <div style={{ width: 400, height: 866, borderRadius: 62, padding: 14, background: "linear-gradient(145deg,#2a4c45,#0f2621 60%,#1c3a34)", boxShadow: "0 80px 120px -50px rgba(0,0,0,.6), inset 0 0 0 2px rgba(167,217,193,.25)", position: "relative", ...style }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", position: "relative", background: C.cream }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,.2), transparent 38%)" }} />
      </div>
      <div style={{ position: "absolute", top: 28, left: "50%", width: 130, height: 34, transform: "translateX(-50%)", borderRadius: 99, background: "#0b1714" }} />
    </div>
  );
}

function Chip({ title, text, p }: { title: string; text: string; p: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 30px 22px 22px", borderRadius: 28, background: "rgba(252,250,245,.96)", boxShadow: "0 40px 70px -30px rgba(0,0,0,.55)", fontFamily: font, opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.94 + p * 0.06})` }}>
      <div style={{ width: 60, height: 60, borderRadius: 18, background: "#E0E7D9", display: "grid", placeItems: "center" }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.forest, boxShadow: `0 0 0 8px ${C.mint}` }} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 22, fontWeight: 500, color: C.muted }}>{text}</div>
      </div>
    </div>
  );
}

// Scenes 3 to 6: one app, four people.
function Role({ index }: { index: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const role = ROLES[index];
  const enter = spring({ frame: f, fps, config: { damping: 18, mass: 0.9 } });
  const leave = out(f, SCENES.role - 14, 14);
  const turn = interpolate(enter, [0, 1], [index === 0 ? -50 : -80, 0]) + interpolate(f, [0, SCENES.role], [-14, -6]) + (1 - leave) * 70;
  const float = Math.sin(f / 22) * 10;
  return (
    <AbsoluteFill style={{ background: C.forest }}>
      <Orbits color={C.mint} opacity={0.1} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 180px", gap: 120 }}>
        <div style={{ flex: 1, fontFamily: font, color: C.cream }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.16em", color: C.mint, opacity: fade(f, 2) * leave }}>ONE APP · {String(index + 1).padStart(2, "0")} / 04</div>
          <div style={{ opacity: leave, marginTop: 26 }}>
            <Words text={role.name} start={4} size={140} color={C.cream} />
          </div>
          <div style={{ opacity: leave, marginTop: 30, maxWidth: 820 }}>
            <Words text={role.line} start={16} size={48} weight={500} color="rgba(239,233,219,.82)" stagger={2} />
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 70, opacity: fade(f, 6) }}>
            {ROLES.map((r, i) => (
              <div key={r.name} style={{ width: 120, height: 6, borderRadius: 6, background: "rgba(239,233,219,.18)", overflow: "hidden" }}>
                <div style={{ height: "100%", background: C.mint, width: i < index ? "100%" : i === index ? `${interpolate(f, [0, SCENES.role], [0, 100], { extrapolateRight: "clamp" })}%` : "0%" }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 640, height: 940, position: "relative", perspective: 2200, display: "grid", placeItems: "center" }}>
          <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,217,193,.38), rgba(167,217,193,0) 65%)" }} />
          <div style={{ transform: `translateY(${float}px) rotateY(${turn}deg) rotateX(6deg)`, opacity: Math.min(enter * 1.4, 1) * leave, transformStyle: "preserve-3d" }}>
            <Phone src={role.screen} />
          </div>
          <div style={{ position: "absolute", left: -120, bottom: 150 }}>
            <Chip title={role.chip[0]} text={role.chip[1]} p={fade(f, 40, 16) * leave} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// Scene 7: always on.
function Support() {
  const f = useCurrentFrame();
  const sweep = interpolate(f, [0, SCENES.support], [0, 420], { easing: Easing.inOut(Easing.cubic) });
  const leave = out(f, SCENES.support - 14);
  const ticks = Array.from({ length: 24 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ background: C.deep, flexDirection: "row", alignItems: "center", padding: "0 200px", gap: 140, opacity: leave }}>
      <div style={{ width: 640, height: 640, position: "relative", opacity: fade(f, 0, 20), transform: `scale(${0.9 + fade(f, 0, 30) * 0.1})` }}>
        <svg viewBox="0 0 400 400" width="640" height="640">
          <circle cx="200" cy="200" r="160" fill="none" stroke={C.cream} strokeOpacity="0.16" strokeWidth="1.5" />
          {ticks.map((i) => {
            const a = (i / 24) * Math.PI * 2;
            const major = i % 6 === 0;
            const lit = (i / 24) * 360 <= sweep % 360 || sweep >= 360;
            return <line key={i} x1={200 + Math.sin(a) * (major ? 138 : 148)} y1={200 - Math.cos(a) * (major ? 138 : 148)} x2={200 + Math.sin(a) * 158} y2={200 - Math.cos(a) * 158} stroke={lit ? C.mint : C.cream} strokeOpacity={lit ? 1 : 0.3} strokeWidth={major ? 3.5 : 2} strokeLinecap="round" />;
          })}
          <g transform={`rotate(${sweep} 200 200)`}>
            <line x1="200" y1="200" x2="200" y2="48" stroke={C.mint} strokeWidth="4" strokeLinecap="round" />
          </g>
          <circle cx="200" cy="200" r="82" fill={C.forest} stroke={C.mint} strokeOpacity="0.45" />
          <text x="200" y="212" textAnchor="middle" fill={C.cream} fontSize="50" fontWeight="600" fontFamily={font}>24/7</text>
        </svg>
      </div>
      <div style={{ flex: 1, fontFamily: font }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.16em", color: C.mint, opacity: fade(f, 4) }}>24/7 SUPPORT</div>
        <div style={{ marginTop: 26 }}><Words text="Real people. Any hour." start={8} size={120} color={C.cream} /></div>
        <div style={{ marginTop: 34 }}><Words text="For guests, owners and our own team, every day of the year." start={30} size={44} weight={500} color="rgba(239,233,219,.8)" stagger={2} /></div>
      </div>
    </AbsoluteFill>
  );
}

// Scene 8: sign-off.
function End() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ background: C.cream, alignItems: "center", justifyContent: "center" }}>
      <Orbits color={C.forest} opacity={0.08} />
      <div style={{ transform: `scale(${0.94 + s * 0.06})`, opacity: s }}>
        <Img src={staticFile("brand/recharge-logo-forest.png")} style={{ width: 900 }} />
      </div>
      <div style={{ marginTop: 56 }}><Words text="Short stays, run properly." start={14} size={64} color={C.ink} style={{ justifyContent: "center" }} /></div>
      <div style={{ marginTop: 28, fontFamily: font, fontSize: 34, fontWeight: 600, color: "#315F50", opacity: fade(f, 34) }}>rechargestays.co.uk</div>
    </AbsoluteFill>
  );
}

function At({ from, len, children }: { from: number; len: number; children: ReactNode }) {
  return <Sequence from={from} durationInFrames={len}>{children}</Sequence>;
}

export function Film() {
  let t = 0;
  const next = (len: number) => { const from = t; t += len; return { from, len }; };
  return (
    <AbsoluteFill style={{ background: C.forest }}>
      <At {...next(SCENES.hook)}><Hook /></At>
      <At {...next(SCENES.logo)}><Logo /></At>
      {ROLES.map((r, i) => <At key={r.name} {...next(SCENES.role)}><Role index={i} /></At>)}
      <At {...next(SCENES.support)}><Support /></At>
      <At {...next(SCENES.end)}><End /></At>
    </AbsoluteFill>
  );
}
