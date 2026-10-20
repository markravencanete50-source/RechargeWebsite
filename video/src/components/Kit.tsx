import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { clamp, ease, ep, handheld, lerp, prog } from "../anim";
import { C, FONT } from "../theme";

/* B-roll: a photograph shot as if on camera, with a slow push in and a gentle hand held drift. */
export function Broll({ src, t, from, to, focus = "60% 45%", shade = "left" }: { src: string; t: number; from: number; to: number; focus?: string; shade?: "left" | "right" | "none" }) {
  const g = shade === "left" ? "linear-gradient(90deg, rgba(11,31,26,.72) 0%, rgba(11,31,26,.3) 45%, rgba(11,31,26,0) 72%)"
    : shade === "right" ? "linear-gradient(270deg, rgba(11,31,26,.72) 0%, rgba(11,31,26,.3) 45%, rgba(11,31,26,0) 72%)" : "none";
  return (
    <AbsoluteFill style={{ transform: handheld(t, 1.1), overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: -60, top: -40, width: 2040, height: 1160, objectFit: "cover", transform: `scale(${lerp(1.04, 1.14, prog(t, from, to))})`, transformOrigin: focus }} />
      <AbsoluteFill style={{ background: g }} />
    </AbsoluteFill>
  );
}

/* A notification style card that pops in at `at`. */
export function Card({ t, at, icon, title, text, style, accent = false, out = 1e9 }: { t: number; at: number; icon: ReactNode; title: string; text?: string; style?: CSSProperties; accent?: boolean; out?: number }) {
  const p = ep(t, at, at + 0.35, ease.back);
  const o = 1 - ep(t, out, out + 0.25);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 18, padding: "18px 28px 18px 18px", borderRadius: 24, background: accent ? C.forest : "rgba(252,250,245,.97)", color: accent ? C.cream : C.ink, boxShadow: "0 30px 60px -24px rgba(0,0,0,.45), 0 0 0 1px rgba(21,45,40,.06)", opacity: clamp(p * 1.5) * o, transform: `translateY(${(1 - p) * 40 + (1 - o) * -20}px) scale(${lerp(0.88, 1, p)})`, ...style }}>
      <div style={{ width: 60, height: 60, borderRadius: 18, background: accent ? "rgba(167,217,193,.18)" : C.wash, color: accent ? C.mint : C.forest, display: "grid", placeItems: "center", flex: "none" }}>{icon}</div>
      <div style={{ font: `600 28px ${FONT}`, lineHeight: 1.25 }}>
        {title}
        {text && <div style={{ font: `500 22px ${FONT}`, color: accent ? C.onDarkMuted : C.muted, marginTop: 2 }}>{text}</div>}
      </div>
    </div>
  );
}

/* A phone with a real Recharge app screen. Plain frame: no fake camera or glare. */
export function Phone({ src, width = 440, style, children }: { src: string; width?: number; style?: CSSProperties; children?: ReactNode }) {
  const pad = width * 0.022;
  return (
    <div style={{ position: "relative", width, height: (width - pad * 2) * (844 / 390) + pad * 2, borderRadius: width * 0.135, padding: pad, background: "#0f2621", boxShadow: "0 60px 110px -40px rgba(0,0,0,.6), inset 0 0 0 1px rgba(167,217,193,.2)", ...style }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: width * 0.115, overflow: "hidden", background: C.cream }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        {children}
      </div>
    </div>
  );
}

/* A browser window around a real page capture (1440 x 900 CSS pixels). */
export function Browser({ children, width, url }: { children: ReactNode; width: number; url: string }) {
  const k = width / 1440;
  return (
    <div style={{ width, borderRadius: 22, overflow: "hidden", background: C.paper, boxShadow: "0 80px 140px -50px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.08)" }}>
      <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#F4F0E6", borderBottom: "1px solid #E3DBCA" }}>
        {["#E0B4A8", "#E8D5A0", "#B9D9C4"].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
        <div style={{ marginLeft: 24, flex: 1, maxWidth: 520, height: 32, borderRadius: 10, background: C.white, display: "flex", alignItems: "center", padding: "0 16px", font: `500 18px ${FONT}`, color: C.muted }}>{url}</div>
      </div>
      <div style={{ position: "relative", width, height: 900 * k }}>{children}</div>
    </div>
  );
}

export const Label = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ font: `600 24px ${FONT}`, letterSpacing: "0.16em", textTransform: "uppercase", color: C.mint, ...style }}>{children}</div>
);
