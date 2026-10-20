// Render the Recharge advertisement and its poster into the website's public/video folder.
// The sound is mastered like the Medville ad: -14 LUFS integrated, peaks held under -1 dBTP.
// Usage: npm run render   (run voiceover/voiceover.py and voiceover/sound.py first if the script changed)
import path from "node:path";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "..", "public", "video");
mkdirSync(outDir, { recursive: true });
mkdirSync(path.join(root, "out"), { recursive: true });
// Use a local Chromium when one is installed; otherwise Remotion downloads its own.
const browserExecutable = [process.env.REMOTION_BROWSER, "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"].find((p) => p && existsSync(p)) ?? null;
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const composition = await selectComposition({ serveUrl, id: "different", browserExecutable });
const duration = JSON.parse(readFileSync(path.join(root, "src/voiceover.json"), "utf8")).duration;

if (!process.argv.includes("--poster-only")) {
  const raw = path.join(root, "out", "raw.mp4");
  await renderMedia({
    composition, serveUrl, browserExecutable, codec: "h264", crf: 20, pixelFormat: "yuv420p", audioCodec: "aac", audioBitrate: "192k", outputLocation: raw,
    onProgress: ({ progress }) => process.stdout.write(`\rfilm: ${Math.round(progress * 100)}%   `),
  });
  console.log();
  // Measure the mix, set the gain that lands it on -14 LUFS, and hold peaks with a fast limiter.
  const report = execFileSync("ffmpeg", ["-hide_banner", "-i", raw, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], { stdio: ["ignore", "ignore", "pipe"] }).toString();
  const inputI = JSON.parse(report.match(/\{[^{}]*\}/)[0]).input_i;
  const gain = (-14 - Number(inputI)).toFixed(2);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-c:v", "copy", "-af", `volume=${gain}dB,alimiter=limit=0.75:attack=0.1:release=30:level=disabled`, "-t", String(duration), "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", path.join(outDir, "recharge-different.mp4")]);
  console.log(`mastered with ${gain} dB`);
}
// The poster is a frame of the real website being booked.
await renderStill({ composition, serveUrl, browserExecutable, frame: Math.round(17.2 * 60), imageFormat: "jpeg", jpegQuality: 82, output: path.join(outDir, "recharge-different-poster.jpg") });
console.log("done", outDir);
