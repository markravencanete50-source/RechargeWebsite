/*
  Timing. Every scene is placed against the voiceover, read from voiceover.json, which
  voiceover/voiceover.py writes. Change a line of the script, regenerate, and the scenes move with it.
*/
import vo from "./voiceover.json";

export const FPS = 60;
export const DURATION = vo.duration;
export const DURATION_FRAMES = Math.ceil(vo.duration * FPS);

export type LineId = "hook" | "brand" | "book" | "clean" | "fix" | "owners" | "support" | "cta";
export type Line = { id: LineId; start: number; end: number; spoken: string; caption: string };
export const LINES = vo.lines as Line[];
export const L = Object.fromEntries(LINES.map((l) => [l.id, l])) as Record<LineId, Line>;

/* Roughly when a word is spoken, by its position in the line: close enough to land an action on it. */
export function wordTime(id: LineId, word: string, nth = 0): number {
  const line = L[id];
  const text = line.spoken;
  let at = -1;
  for (let i = 0; i <= nth; i++) at = text.indexOf(word, at + 1);
  if (at < 0) throw new Error(`"${word}" is not in the ${id} line`);
  return line.start + (at / text.length) * (line.end - line.start);
}

/* Scene cuts: halfway through the pause between two lines. */
const cut = (a: LineId, b: LineId) => (L[a].end + L[b].start) / 2;
export const CUT = {
  brand: cut("hook", "brand"),
  book: cut("brand", "book"),
  clean: cut("book", "clean"),
  fix: cut("clean", "fix"),
  owners: cut("fix", "owners"),
  support: cut("owners", "support"),
  cta: cut("support", "cta"),
};
/* Every transition takes this long, centred on its cut. */
export const T = 0.5;
