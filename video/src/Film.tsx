import { ClipboardCheck, FileSpreadsheet, House, KeyRound, Mail, MessageSquare, Phone, PoundSterling, Sparkles, Users, Wrench } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Html5Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import TL from "./timeline.json";

// "Why Recharge is different", in the style of the clean product films the client sent as a template:
// a light page, words that blur in with the voiceover, a pointer that clicks into the real app, the real
// desktop app tilted in 3D with a soft glow, the roles orbiting the Recharge mark, and a logo resolve.
// 1920 x 1080, 30 fps. The voiceover clips and the score (audio/score.py) share timeline.json.

export const FPS = TL.fps;
export const DURATION = TL.duration;
const C = { page: "#FCFAF5", cream: "#EFE9DB", forest: "#1B3E38", ink: "#152D28", mint: "#A7D9C1", moss: "#315F50", muted: "#4E6259" };
const font = "Montserrat, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const pop = Easing.out(Easing.back(1.8));
type Clip = { text: string; start: number; frames: number };
const clips = TL.clips as Record<string, Clip>;
const S = TL.scenes;

// When each word of a clip is spoken, spread over the clip by length.
function wordTimes(c: Clip) {
  const words = c.text.split(" ");
  const total = words.reduce((n, w) => n + w.length + 1, 0);
  let acc = 0;
  return words.map((w) => { const at = c.start + Math.round((acc / total) * c.frames * 0.92); acc += w.length + 1; return { w, at }; });
}

// A spoken line on screen: each word blurs in as it is said, and the line blurs out at `until`.
function Line({ clip, until, size = 76, accent = [], color = C.ink, style }: { clip: string; until: number; size?: number; accent?: number[]; color?: string; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const c = clips[clip];
  if (f < c.start - 2 || f > until + 8) return null;
  const gone = interpolate(f, [until, until + 8], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.26}px`, fontFamily: font, fontSize: size, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.15, opacity: 1 - gone, filter: `blur(${gone * 14}px)`, ...style }}>
      {wordTimes(c).map(({ w, at }, i) => {
        const p = interpolate(f, [at, at + 8], [0, 1], { ...clamp, easing: ease });
        return <span key={i} style={{ display: "inline-block", color: accent.includes(i) ? C.moss : color, opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateX(${(1 - p) * -18}px)` }}>{w}</span>;
      })}
    </div>
  );
}

// The subtitle-style caption used over the app shots, so the film also reads with the sound off.
function Caption({ clip, until }: { clip: string; until: number }) {
  const f = useCurrentFrame();
  const c = clips[clip];
  const p = interpolate(f, [c.start - 2, c.start + 6, until, until + 6], [0, 1, 1, 0], clamp);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      <div style={{ padding: "18px 34px", borderRadius: 999, background: "rgba(252,250,245,.94)", boxShadow: "0 18px 50px -20px rgba(21,45,40,.45)", fontFamily: font, fontSize: 40, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>{c.text.replace("twenty four seven", "24/7")}</div>
    </div>
  );
}

function Bubble({ at, icon, x, y, size = 96, jitter = 0, until = 1e9 }: { at: number; icon: ReactNode; x: number; y: number; size?: number; jitter?: number; until?: number }) {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 9], [0, 1], { ...clamp, easing: pop }) * interpolate(f, [until, until + 8], [1, 0], clamp);
  if (p <= 0) return null;
  const j = jitter ? Math.sin(f * 1.7 + x) * jitter : 0;
  return (
    <div style={{ position: "absolute", left: x - size / 2 + j, top: y - size / 2 - j, width: size, height: size, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", color: C.forest, transform: `scale(${p})`, boxShadow: `0 0 0 1px rgba(21,45,40,.06), 0 14px 30px -12px rgba(21,45,40,.35), 0 0 60px rgba(167,217,193,${0.55 * p})` }}>
      {icon}
    </div>
  );
}

function Card({ at, icon, label, x, y, until }: { at: number; icon: ReactNode; label: string; x: number; y: number; until: number }) {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: pop });
  const gone = interpolate(f, [until, until + 8], [0, 1], clamp);
  if (p <= 0 || gone >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 16, padding: "16px 26px 16px 16px", borderRadius: 22, background: "#fff", fontFamily: font, fontSize: 30, fontWeight: 600, color: C.ink, opacity: p * (1 - gone), filter: `blur(${gone * 10}px)`, transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + p * 0.1})`, boxShadow: "0 0 0 1px rgba(21,45,40,.06), 0 24px 50px -24px rgba(21,45,40,.45), 0 0 70px rgba(167,217,193,.45)" }}>
      <span style={{ width: 56, height: 56, borderRadius: 16, background: "#E0E7D9", display: "grid", placeItems: "center", color: C.forest }}>{icon}</span>
      {label}
    </div>
  );
}

function Pointer({ x, y, press, opacity }: { x: number; y: number; press: boolean; opacity: number }) {
  return (
    <svg width="54" height="54" viewBox="0 0 24 24" style={{ position: "absolute", left: x - 6, top: y - 3, opacity, transform: `scale(${press ? 0.86 : 1})`, transformOrigin: "6px 3px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.3))" }}>
      <path d="M4 2 L4 19 L8.6 14.8 L11.6 21.5 L14.4 20.3 L11.4 13.7 L17.6 13.4 Z" fill="#fff" stroke={C.ink} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function Ripple({ at, x, y }: { at: number; x: number; y: number }) {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 14], [0, 1], clamp);
  if (f < at || p >= 1) return null;
  return <div style={{ position: "absolute", left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: "50%", border: `4px solid ${C.mint}`, transform: `scale(${0.3 + p})`, opacity: 1 - p }} />;
}

function Page({ children }: { children: ReactNode }) {
  return <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 40%, ${C.page} 55%, ${C.cream} 100%)` }}>{children}</AbsoluteFill>;
}

// Hook: the mess, then the question.
function Hook() {
  return (
    <Page>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Line clip="messy" until={clips.messy.start + clips.messy.frames + 8} accent={[5]} />
        <Bubble until={clips.messy.start + clips.messy.frames + 8} at={TL.pops[0]} icon={<Phone size={40} />} x={1250} y={390} jitter={4} />
        <Bubble until={clips.messy.start + clips.messy.frames + 8} at={TL.pops[1]} icon={<Mail size={40} />} x={1500} y={430} jitter={4} />
        <Bubble until={clips.messy.start + clips.messy.frames + 8} at={TL.pops[2]} icon={<FileSpreadsheet size={40} />} x={1430} y={690} jitter={4} />
        <Bubble until={clips.messy.start + clips.messy.frames + 8} at={TL.pops[3]} icon={<KeyRound size={40} />} x={1130} y={700} size={80} jitter={4} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Line clip="what" until={S.parts - 9} accent={[5, 6]} />
      </AbsoluteFill>
    </Page>
  );
}

// The moving parts, each with the job it brings.
function Parts() {
  const f = useCurrentFrame();
  const words = ["g1", "g2", "g3", "g4"];
  const out = S.one - 10;
  const gone = interpolate(f, [out, out + 8], [0, 1], clamp);
  return (
    <Page>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 30, fontFamily: font, fontSize: 84, fontWeight: 600, letterSpacing: "-0.025em", opacity: 1 - gone, filter: `blur(${gone * 14}px)` }}>
          {words.map((k, i) => {
            const p = interpolate(f, [clips[k].start, clips[k].start + 8], [0, 1], { ...clamp, easing: ease });
            return <span key={k} style={{ color: i % 2 ? C.moss : C.ink, opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * 16}px)`, display: "inline-block" }}>{clips[k].text}</span>;
          })}
        </div>
      </AbsoluteFill>
      <Card at={clips.g1.start} until={out} icon={<MessageSquare size={30} />} label="New guest message" x={250} y={250} />
      <Card at={clips.g2.start} until={out} icon={<ClipboardCheck size={30} />} label="Checklist done" x={1180} y={200} />
      <Card at={clips.g3.start} until={out} icon={<Wrench size={30} />} label="Repair logged" x={330} y={720} />
      <Card at={clips.g4.start} until={out} icon={<PoundSterling size={30} />} label="Payout ready" x={1220} y={760} />
    </Page>
  );
}

// "All in one place": a click on the Recharge app opens it.
function One() {
  const f = useCurrentFrame();
  const { cursor, click } = TL.one;
  const tile = interpolate(f, [clips.one.start + 20, clips.one.start + 30], [0, 1], { ...clamp, easing: pop });
  const zoom = interpolate(f, [click + 2, S.dash], [1, 14], { ...clamp, easing: Easing.in(Easing.cubic) });
  const move = interpolate(f, [cursor, click - 3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cx = 1240 + (960 - 1240) * move;
  const cy = 860 + (640 - 860) * move;
  const press = f >= click && f < click + 4;
  const flash = interpolate(f, [S.dash - 6, S.dash], [0, 1], clamp);
  return (
    <Page>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <Line clip="one" until={click} accent={[3]} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960 - 80, top: 560, width: 160, height: 160, borderRadius: 40, background: C.forest, display: "grid", placeItems: "center", transform: `scale(${tile * (press ? 0.92 : 1) * zoom})`, boxShadow: "0 30px 60px -24px rgba(21,45,40,.6), 0 0 90px rgba(167,217,193,.6)" }}>
        <Img src={staticFile("brand/recharge-mark.png")} style={{ width: 110, filter: "brightness(0) invert(0.93) sepia(0.15)" }} />
      </div>
      {f >= cursor && f < click + 8 && <Pointer x={cx} y={cy} press={press} opacity={interpolate(f, [cursor, cursor + 5], [0, 1], clamp)} />}
      <Ripple at={click} x={960} y={640} />
      <AbsoluteFill style={{ background: C.page, opacity: flash }} />
    </Page>
  );
}

// The real desktop app in 3D: home, a click on Cleans, the Cleans section.
type Cam = { f: number; rx: number; ry: number; rz: number; s: number; x: number; y: number };
const CAM: Cam[] = [
  { f: 0, rx: 34, ry: -26, rz: 9, s: 0.62, x: -200, y: 160 },
  { f: 16, rx: 20, ry: -14, rz: 5, s: 0.88, x: -170, y: -10 },
  { f: 100, rx: 20, ry: -14, rz: 5, s: 0.88, x: -170, y: -10 },
  { f: 116, rx: 10, ry: -6, rz: 2, s: 1.2, x: 420, y: -60 },
  { f: 160, rx: 10, ry: -6, rz: 2, s: 1.2, x: 420, y: -60 },
  { f: 176, rx: 16, ry: 14, rz: -4, s: 0.9, x: 40, y: -30 },
  { f: 1e6 - 20, rx: 16, ry: 14, rz: -4, s: 0.9, x: 40, y: -30 },
  { f: 1e6, rx: 30, ry: 22, rz: -8, s: 0.75, x: 0, y: 200 },
];
// The last two moves (hold, then leave) are timed from the end of the scene, which follows the voice.
const DASH_LEN = S.see - S.dash;
CAM[CAM.length - 2].f = DASH_LEN - 20;
CAM[CAM.length - 1].f = DASH_LEN;
function cam(f: number) {
  let i = 0;
  while (i < CAM.length - 2 && f >= CAM[i + 1].f) i++;
  const a = CAM[i], b = CAM[i + 1];
  const p = interpolate(f, [a.f, b.f], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const mix = (k: keyof Cam) => a[k] + (b[k] - a[k]) * p;
  return { rx: mix("rx"), ry: mix("ry"), rz: mix("rz"), s: mix("s"), x: mix("x"), y: mix("y") };
}
function Dash() {
  const f = useCurrentFrame();
  const local = f - S.dash;
  const c = cam(local);
  const W = 1500, H = W * (TL.desk.h / TL.desk.w), k = W / TL.desk.w;
  const { cursor, click, swap } = TL.dash;
  const move = interpolate(f, [cursor, click - 3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const px = (720 + (TL.desk.cleans.x - 720) * move) * k;
  const py = (450 + (TL.desk.cleans.y - 450) * move) * k;
  const show = interpolate(f, [swap, swap + 6], [0, 1], clamp);
  const exit = interpolate(local, [DASH_LEN - 18, DASH_LEN], [0, 1], clamp);
  return (
    <Page>
      <AbsoluteFill style={{ perspective: 2600, alignItems: "center", justifyContent: "center", opacity: 1 - exit, filter: `blur(${exit * 12}px)` }}>
        <div style={{ position: "relative", width: W, height: H, transform: `translate(${c.x}px, ${c.y}px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotateZ(${c.rz}deg) scale(${c.s})`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: -40, borderRadius: 60, background: "conic-gradient(from 200deg, #A7D9C1, #315F50, #E3DBCA, #A7D9C1)", filter: "blur(60px)", opacity: 0.75 }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 26, overflow: "hidden", boxShadow: "0 0 0 1px rgba(21,45,40,.08), 0 60px 120px -40px rgba(21,45,40,.55)" }}>
            <Img src={staticFile("desk/d-home.webp")} style={{ position: "absolute", width: "100%", height: "100%" }} />
            <Img src={staticFile("desk/d-cleans.webp")} style={{ position: "absolute", width: "100%", height: "100%", opacity: show }} />
          </div>
          {f >= cursor && f < swap + 30 && <Pointer x={px} y={py} press={f >= click && f < click + 4} opacity={interpolate(f, [cursor, cursor + 5, swap + 22, swap + 30], [0, 1, 1, 0], clamp)} />}
          <Ripple at={click} x={TL.desk.cleans.x * k} y={TL.desk.cleans.y * k} />
        </div>
      </AbsoluteFill>
      <Caption clip="meet" until={clips.runs.start - 2} />
      <Caption clip="runs" until={clips.runs.start + clips.runs.frames + 18} />
      <Caption clip="job" until={clips.job.start + clips.job.frames + 18} />
    </Page>
  );
}

// Who sees what: the line on the left, the real phone screen on the right.
const SEE = [
  { clip: "s1", screen: "app/owner-reports.webp" },
  { clip: "s2", screen: "app/cleaner-calendar.webp" },
  { clip: "s3", screen: "app/stays-inbox.webp" },
];
function See() {
  const f = useCurrentFrame();
  const enter = interpolate(f, [S.see, S.see + 14], [0, 1], { ...clamp, easing: ease });
  const exit = interpolate(f, [S.connected - 12, S.connected], [0, 1], clamp);
  const current = SEE.filter((s) => f >= clips[s.clip].start - 4).length - 1;
  return (
    <Page>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 200px", gap: 120, opacity: 1 - exit, filter: `blur(${exit * 12}px)` }}>
        <div style={{ flex: 1, position: "relative", height: 300 }}>
          {SEE.map((s, i) => (
            <AbsoluteFill key={s.clip} style={{ justifyContent: "center" }}>
              <Line clip={s.clip} until={i < 2 ? clips[SEE[i + 1].clip].start - 8 : S.connected} size={80} accent={[0]} style={{ justifyContent: "flex-start" }} />
            </AbsoluteFill>
          ))}
        </div>
        <div style={{ position: "relative", width: 430, height: 430 * (844 / 390) + 20, transform: `translateY(${(1 - enter) * 120}px)`, opacity: enter }}>
          <div style={{ position: "absolute", inset: -30, borderRadius: 90, background: "conic-gradient(from 120deg, #A7D9C1, #315F50, #E3DBCA, #A7D9C1)", filter: "blur(50px)", opacity: 0.6 }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 58, padding: 10, background: "#0f2621", boxShadow: "0 50px 90px -40px rgba(21,45,40,.6)" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 48, overflow: "hidden", background: C.cream }}>
              {SEE.map((s, i) => {
                const at = clips[s.clip].start - 4;
                const p = i === 0 ? 1 : interpolate(f, [at, at + 8], [0, 1], { ...clamp, easing: ease });
                return i <= current ? <Img key={s.clip} src={staticFile(s.screen)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `translateY(${(1 - p) * 100}%)` }} /> : null;
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Page>
  );
}

// All connected: the four roles orbit the Recharge mark.
function Connected() {
  const f = useCurrentFrame();
  const local = f - S.connected;
  const draw = interpolate(local, [0, 22], [0, 1], { ...clamp, easing: ease });
  const exit = interpolate(f, [S.end - 12, S.end], [0, 1], clamp);
  const icons = [<Users key="u" size={40} />, <Sparkles key="s" size={40} />, <Wrench key="w" size={40} />, <House key="h" size={40} />];
  const rings = [250, 380];
  const mark = interpolate(local, [4, 14], [0, 1], { ...clamp, easing: pop });
  return (
    <Page>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - exit, filter: `blur(${exit * 12}px)`, transform: "translateY(60px)" }}>
        <svg width="1000" height="1000" viewBox="-500 -500 1000 1000" style={{ position: "absolute", overflow: "visible" }}>
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#A7D9C1" /><stop offset="0.5" stopColor="#315F50" /><stop offset="1" stopColor="#A7D9C1" /></linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="8" /></filter>
          </defs>
          {rings.map((r, i) => {
            const len = 2 * Math.PI * r;
            return (
              <g key={r} transform={`rotate(${local * (i ? -0.4 : 0.6)})`}>
                <circle r={r} fill="none" stroke="url(#ring)" strokeWidth="10" opacity="0.45" filter="url(#glow)" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
                <circle r={r} fill="none" stroke="url(#ring)" strokeWidth="3" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", width: 170, height: 170, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", transform: `scale(${mark})`, boxShadow: "0 20px 50px -20px rgba(21,45,40,.45), 0 0 80px rgba(167,217,193,.7)" }}>
          <Img src={staticFile("brand/recharge-mark.png")} style={{ width: 120 }} />
        </div>
        {icons.map((icon, i) => {
          const r = rings[i % 2];
          const a = (i / 4) * Math.PI * 2 + local * (i % 2 ? -0.007 : 0.01) - Math.PI / 2;
          return <Bubble key={i} at={S.connected + 10 + i * 4} icon={icon} x={960 + Math.cos(a) * r} y={540 + Math.sin(a) * r} />;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
        <Line clip="conn" until={S.end - 12} accent={[1]} size={72} />
      </AbsoluteFill>
      <Caption clip="real" until={S.end - 12} />
    </Page>
  );
}

// The logo resolves, then the promise and the address.
function End() {
  const f = useCurrentFrame();
  const at = clips.end1.start;
  const mark = interpolate(f, [at - 6, at + 6], [0, 1], { ...clamp, easing: pop });
  const reveal = interpolate(f, [at + 8, at + 24], [0, 1], { ...clamp, easing: ease });
  const W = 980;
  return (
    <Page>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 70 }}>
        <div style={{ position: "relative", width: W, height: W * (366 / 1886), opacity: mark, filter: `blur(${(1 - mark) * 12}px)` }}>
          <Img src={staticFile("brand/recharge-logo-forest.png")} style={{ position: "absolute", width: W, clipPath: `inset(0 ${(1 - reveal) * 80.6}% 0 0)`, transform: `translateX(${(1 - reveal) * (W * 0.403)}px) scale(${0.9 + mark * 0.1})` }} />
        </div>
        <Line clip="end2" until={DURATION + 20} size={64} accent={[2, 3]} />
        <div style={{ fontFamily: font, fontSize: 34, fontWeight: 600, color: C.moss, letterSpacing: "0.02em", opacity: interpolate(f, [clips.end2.start + clips.end2.frames, clips.end2.start + clips.end2.frames + 10], [0, 1], clamp) }}>rechargestays.co.uk</div>
      </AbsoluteFill>
    </Page>
  );
}

export function Film() {
  // Scenes read the absolute frame, so they are shown with Global (no clock shift). The voice clips use
  // Sequences so each one starts playing at its own frame.
  return (
    <AbsoluteFill style={{ background: C.page }}>
      <Global from={0} to={S.parts}><Hook /></Global>
      <Global from={S.parts} to={S.one}><Parts /></Global>
      <Global from={S.one} to={S.dash}><One /></Global>
      <Global from={S.dash} to={S.see}><Dash /></Global>
      <Global from={S.see} to={S.connected}><See /></Global>
      <Global from={S.connected} to={S.end}><Connected /></Global>
      <Global from={S.end} to={DURATION}><End /></Global>
      {Object.entries(clips).map(([k, c]) => (
        <Sequence key={k} from={c.start} durationInFrames={Math.min(DURATION, c.start + c.frames + 4) - c.start}>
          <Html5Audio src={staticFile(`vo/c-${k}.wav`)} />
        </Sequence>
      ))}
      <Html5Audio src={staticFile("audio/score.wav")} />
    </AbsoluteFill>
  );
}

// Shows its children only between two frames, without shifting the clock they read.
function Global({ from, to, children }: { from: number; to: number; children: ReactNode }) {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
}
