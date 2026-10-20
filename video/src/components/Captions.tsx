import { useCurrentFrame, useVideoConfig } from "remotion";
import { ep, prog } from "../anim";
import { C, FONT } from "../theme";
import { LINES } from "../timeline";

/*
  Subtitles for the voiceover, so the ad works with the sound off. A line is shown in short phrases;
  the word being spoken is full white and the rest are softer. The end card says the call to action,
  so it has no caption.
*/
type Chunk = { words: string[]; start: number; end: number; wordTimes: number[] };

function chunks(): Chunk[] {
  const out: Chunk[] = [];
  for (const line of LINES) {
    if (line.id === "cta") continue;
    const words = line.caption.split(" ");
    const total = words.join(" ").length;
    const span = line.end - line.start;
    let pos = 0;
    const times = words.map((w) => { const at = line.start + (pos / total) * span; pos += w.length + 1; return at; });
    // Phrases of up to seven words, never across a full stop, split evenly.
    const sentences: number[][] = [];
    let cur: number[] = [];
    words.forEach((w, i) => { cur.push(i); if (/[.?!]$/.test(w) || i === words.length - 1) { sentences.push(cur); cur = []; } });
    for (const sent of sentences) {
      const n = Math.ceil(sent.length / 7);
      const size = Math.ceil(sent.length / n);
      for (let k = 0; k < sent.length; k += size) {
        const idx = sent.slice(k, k + size);
        const last = idx[idx.length - 1];
        out.push({ words: idx.map((j) => words[j]), wordTimes: idx.map((j) => times[j]), start: times[idx[0]], end: last === words.length - 1 ? line.end : times[last + 1] });
      }
    }
  }
  return out;
}
const CHUNKS = chunks();

export function Captions() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = CHUNKS.find((k) => t >= k.start - 0.08 && t < k.end + 0.25);
  if (!c) return null;
  const inP = ep(t, c.start - 0.08, c.start + 0.12);
  const outP = prog(t, c.end + 0.05, c.end + 0.25);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 54, display: "flex", justifyContent: "center", zIndex: 100 }}>
      <div style={{ padding: "14px 30px", borderRadius: 18, background: "rgba(11,31,26,.8)", font: `600 40px ${FONT}`, letterSpacing: "-0.01em", color: C.white, maxWidth: 1500, textAlign: "center", opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 14}px)`, boxShadow: "0 12px 30px rgba(0,0,0,.25)" }}>
        {c.words.map((w, i) => (
          <span key={i} style={{ color: t >= c.wordTimes[i] - 0.05 ? C.white : "rgba(167,217,193,.6)" }}>{w}{i < c.words.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </div>
  );
}
