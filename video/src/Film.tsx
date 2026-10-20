import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Html5Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import taps from "./taps.json";
import TL from "./timeline.json";

// "Why Recharge is different": a glance at the real app for owners, guests, cleaners and maintenance,
// with 24/7 support. 1920 x 1080, 30 fps, 120 bpm: one beat is 15 frames and every cut lands on one.
// Timings come from timeline.json, which the score (audio/score.py) is built from too.

export const FPS = TL.fps;
export const DURATION = TL.duration;
const C = { cream: "#EFE9DB", paper: "#FCFAF5", forest: "#1B3E38", deep: "#12302A", ink: "#152D28", mint: "#A7D9C1", moss: "#315F50" };
const font = "Montserrat, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const slamEase = Easing.out(Easing.back(2.2));

// A word or line that lands: from big and blurred to rest in 6 frames.
function Slam({ at, children, size, color, weight = 600, style }: { at: number; children: ReactNode; size: number; color: string; weight?: number; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 6], [0, 1], { ...clamp, easing: slamEase });
  const o = interpolate(f, [at, at + 3], [0, 1], clamp);
  const blur = interpolate(f, [at, at + 6], [12, 0], clamp);
  return (
    <div style={{ fontFamily: font, fontSize: size, fontWeight: weight, letterSpacing: "-0.035em", lineHeight: 1.04, color, opacity: o, transform: `scale(${1.4 - 0.4 * p})`, filter: `blur(${blur}px)`, transformOrigin: "left center", ...style }}>
      {children}
    </div>
  );
}

type Enter = "cut" | "circle" | "wipe" | "push" | "zoom" | "flash";

// How a scene arrives. Each is 8 frames, and no two in a row are the same.
function Scene({ enter, bg, children }: { enter: Enter; bg: string; children: ReactNode }) {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 8], [0, 1], { ...clamp, easing: out });
  const style: CSSProperties = { background: bg };
  if (enter === "circle") style.clipPath = `circle(${p * 120}% at 50% 50%)`;
  if (enter === "wipe") style.clipPath = `inset(0 0 0 ${(1 - p) * 100}%)`;
  if (enter === "push") style.transform = `translateY(${(1 - p) * 100}%)`;
  if (enter === "zoom") { style.transform = `scale(${1.25 - 0.25 * p})`; style.opacity = p; }
  return (
    <AbsoluteFill style={style}>
      {children}
      {enter === "flash" && <AbsoluteFill style={{ background: C.cream, opacity: interpolate(f, [0, 5], [1, 0], clamp) }} />}
    </AbsoluteFill>
  );
}

// Hook: the moving parts, one per beat, then the problem.
function Hook() {
  const f = useCurrentFrame();
  const words = ["Guests.", "Cleans.", "Repairs.", "Owners."];
  const i = TL.hook.words.filter((w) => f >= w).length - 1;
  if (f < TL.hook.line[0]) {
    const dark = i % 2 === 1;
    return (
      <AbsoluteFill style={{ background: dark ? C.forest : C.cream, justifyContent: "center", paddingLeft: 200 }}>
        <div style={{ fontFamily: font, fontSize: 30, fontWeight: 600, letterSpacing: "0.16em", color: dark ? C.mint : C.moss, marginBottom: 24 }}>{`0${i + 1} / 04`}</div>
        <Slam at={TL.hook.words[i]} size={230} color={dark ? C.cream : C.ink}>{words[i]}</Slam>
      </AbsoluteFill>
    );
  }
  const line = ["Too", "many", "moving", "parts."];
  return (
    <AbsoluteFill style={{ background: C.forest, justifyContent: "center", paddingLeft: 200 }}>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", maxWidth: 1500 }}>
        {line.map((w, k) => <Slam key={w} at={TL.hook.line[k]} size={170} color={k === 3 ? C.mint : C.cream}>{w}</Slam>)}
      </div>
    </AbsoluteFill>
  );
}

// Turn: one app runs it all.
function Turn() {
  const f = useCurrentFrame();
  const at = TL.turn.line - TL.turn.start;
  const logo = interpolate(f, [0, 7], [0, 1], { ...clamp, easing: slamEase });
  return (
    <Scene enter="circle" bg={C.cream}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 70 }}>
        <Img src={staticFile("brand/recharge-logo-forest.png")} style={{ width: 1000, transform: `scale(${1.3 - 0.3 * logo})`, filter: `blur(${(1 - logo) * 12}px)`, opacity: Math.min(1, logo * 2) }} />
        <div style={{ display: "flex", gap: 24 }}>
          {["One", "app", "runs", "it", "all."].map((w, k) => <Slam key={w} at={at + k * 3} size={84} color={k === 1 ? C.moss : C.ink} style={{ transformOrigin: "center" }}>{w}</Slam>)}
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

const ROLES = [
  { name: "Owners", a: "owner.webp", b: "owner-reports.webp", tap: "owner-reports", l1: "Your portfolio at a glance.", l2: "Earnings and occupancy, live.", enter: "push" as Enter },
  { name: "Guests", a: "stays.webp", b: "stays-inbox.webp", tap: "stays-inbox", l1: "Every guest message in one inbox.", l2: "Answered day and night.", enter: "wipe" as Enter },
  { name: "Cleaners", a: "cleaner.webp", b: "cleaner-calendar.webp", tap: "cleaner-calendar", l1: "Cleans scheduled from every booking.", l2: "The whole week on one calendar.", enter: "zoom" as Enter },
  { name: "Maintenance", a: "ready.webp", b: "ready-work.webp", tap: "ready-work", l1: "Every repair logged.", l2: "Tracked through to the finish.", enter: "push" as Enter },
];
const PHONE_W = 440;
const PAD = 10;
const SCALE = (PHONE_W - PAD * 2) / 390;

// One role: the real app, a tap on a real tab, and the screen it opens.
function Role({ index }: { index: number }) {
  const f = useCurrentFrame();
  const r = ROLES[index];
  const R = TL.role;
  const tap = (taps as Record<string, { x: number; y: number }>)[r.tap];
  const rise = interpolate(f, [0, 12], [1, 0], { ...clamp, easing: out });
  const punch = interpolate(f, [R.tap, R.tap + 6], [1, 1.05], { ...clamp, easing: out });
  const swap = interpolate(f, [R.swap, R.swap + 6], [0, 1], { ...clamp, easing: out });
  // The pointer starts mid-screen, travels to the tab, presses, and leaves a ripple.
  const move = interpolate(f, [R.cursor + 4, R.tap - 2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cx = PAD + (195 + (tap.x - 195) * move) * SCALE;
  const cy = PAD + (520 + (tap.y - 520) * move) * SCALE;
  const cursorIn = interpolate(f, [R.cursor, R.cursor + 5, R.swap + 10, R.swap + 16], [0, 1, 1, 0], clamp);
  const press = f >= R.tap && f < R.tap + 4 ? 0.78 : 1;
  const ripple = interpolate(f, [R.tap, R.tap + 14], [0, 1], clamp);
  const l1Out = interpolate(f, [R.label2 - 4, R.label2], [0, 1], { ...clamp, easing: out });

  return (
    <Scene enter={r.enter} bg={C.forest}>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 170px", gap: 100 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font, fontSize: 28, fontWeight: 600, letterSpacing: "0.16em", color: C.mint, marginBottom: 20 }}>{`ONE APP  ·  0${index + 1}`}</div>
          <Slam at={0} size={150} color={C.cream}>{r.name}</Slam>
          <div style={{ position: "relative", height: 150, marginTop: 36, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${-l1Out * 100}%)`, opacity: 1 - l1Out }}>
              <Slam at={R.label1} size={58} weight={500} color="rgba(239,233,219,.9)">{r.l1}</Slam>
            </div>
            <div style={{ position: "absolute", inset: 0 }}>
              <Slam at={R.label2} size={58} weight={500} color={C.mint}>{r.l2}</Slam>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 60 }}>
            {ROLES.map((x, k) => <div key={x.name} style={{ width: 90, height: 6, borderRadius: 6, background: k <= index ? C.mint : "rgba(239,233,219,.2)" }} />)}
          </div>
        </div>
        <div style={{ position: "relative", width: PHONE_W, transform: `translateY(${rise * 140}px) scale(${punch})`, opacity: 1 - rise * 0.6 }}>
          <div style={{ width: PHONE_W, height: (PHONE_W - PAD * 2) * (844 / 390) + PAD * 2, borderRadius: 60, padding: PAD, background: "#0f2621", boxShadow: "0 50px 90px -40px rgba(0,0,0,.6)" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", background: C.cream }}>
              <Img src={staticFile(`app/${r.a}`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              <Img src={staticFile(`app/${r.b}`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `translateX(${(1 - swap) * 100}%)` }} />
            </div>
          </div>
          <div style={{ position: "absolute", left: cx, top: cy, width: 0, height: 0, opacity: cursorIn }}>
            <div style={{ position: "absolute", left: -60, top: -60, width: 120, height: 120, borderRadius: "50%", border: `4px solid ${C.mint}`, transform: `scale(${ripple})`, opacity: f >= R.tap ? 1 - ripple : 0 }} />
            <div style={{ position: "absolute", left: -24, top: -24, width: 48, height: 48, borderRadius: "50%", background: "rgba(252,250,245,.95)", boxShadow: `0 0 0 6px rgba(27,62,56,.35), 0 10px 20px rgba(0,0,0,.35)`, transform: `scale(${press})` }} />
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

// Support: the clock runs through the day, then 24/7 lands.
function Support() {
  const f = useCurrentFrame();
  const slam = TL.support.slam - TL.support.start;
  const minutes = Math.round(interpolate(f, [4, slam - 2], [0, 24 * 60 - 1], { ...clamp, easing: Easing.in(Easing.quad) }));
  const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  return (
    <Scene enter="circle" bg={C.cream}>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 200 }}>
        <div style={{ fontFamily: font, fontSize: 30, fontWeight: 600, letterSpacing: "0.16em", color: C.moss, marginBottom: 20 }}>SUPPORT</div>
        {f < slam ? (
          <div style={{ fontFamily: font, fontSize: 260, fontWeight: 600, letterSpacing: "-0.04em", color: C.ink, fontVariantNumeric: "tabular-nums" }}>{time}</div>
        ) : (
          <Slam at={slam} size={260} color={C.forest}>24/7</Slam>
        )}
        <div style={{ marginTop: 20 }}>
          <Slam at={TL.support.line - TL.support.start} size={76} weight={500} color={C.ink}>Real people. Any hour.</Slam>
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

// End: the brand, the promise, the address.
function End() {
  const f = useCurrentFrame();
  const logo = interpolate(f, [0, 7], [0, 1], { ...clamp, easing: slamEase });
  return (
    <Scene enter="flash" bg={C.forest}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("brand/recharge-logo-cream.png")} style={{ width: 1000, transform: `scale(${1.3 - 0.3 * logo})`, filter: `blur(${(1 - logo) * 12}px)`, opacity: Math.min(1, logo * 2) }} />
        <div style={{ marginTop: 64 }}>
          <Slam at={TL.end.line - TL.end.start} size={80} color={C.cream} style={{ transformOrigin: "center" }}>Short stays, run properly.</Slam>
        </div>
        <div style={{ marginTop: 26 }}>
          <Slam at={TL.end.url - TL.end.start} size={42} weight={600} color={C.mint} style={{ transformOrigin: "center", letterSpacing: "0.02em" }}>rechargestays.co.uk</Slam>
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

export function Film() {
  const roleEnd = (i: number) => (TL.roles[i + 1] ?? TL.support.start) - TL.roles[i];
  return (
    <AbsoluteFill style={{ background: C.forest }}>
      <Sequence durationInFrames={TL.turn.start}><Hook /></Sequence>
      <Sequence from={TL.turn.start} durationInFrames={TL.roles[0] - TL.turn.start}><Turn /></Sequence>
      {TL.roles.map((start, i) => (
        <Sequence key={start} from={start} durationInFrames={roleEnd(i)}><Role index={i} /></Sequence>
      ))}
      <Sequence from={TL.support.start} durationInFrames={TL.end.start - TL.support.start}><Support /></Sequence>
      <Sequence from={TL.end.start} durationInFrames={TL.duration - TL.end.start}><End /></Sequence>
      <Html5Audio src={staticFile("audio/score.wav")} />
    </AbsoluteFill>
  );
}
