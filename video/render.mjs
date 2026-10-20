// Render the "why we are different" film and its poster into the website's public/video folder.
// Usage: npm run render
import path from "node:path";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "..", "public", "video");
mkdirSync(outDir, { recursive: true });
// Use a local Chromium when one is installed; otherwise Remotion downloads its own.
const browserExecutable = [process.env.REMOTION_BROWSER, "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"].find((p) => p && existsSync(p)) ?? null;
// The score is built from the same timeline as the picture (audio/score.py).
execFileSync("python3", [path.join(root, "audio", "score.py")], { stdio: "inherit" });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const composition = await selectComposition({ serveUrl, id: "different", browserExecutable });

if (!process.argv.includes("--poster-only")) {
  const raw = path.join(root, "out", "raw.mp4");
  mkdirSync(path.dirname(raw), { recursive: true });
  await renderMedia({
    composition, serveUrl, browserExecutable, codec: "h264", crf: 20, pixelFormat: "yuv420p", audioCodec: "aac", audioBitrate: "192k",
    outputLocation: raw,
    onProgress: ({ progress }) => process.stdout.write(`\rfilm: ${Math.round(progress * 100)}%   `),
  });
  console.log();
  // Level the music to -16 LUFS (calm, web level) with peaks under -1.5 dBTP, and let the file start playing early.
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", raw, "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", path.join(outDir, "recharge-different.mp4")]);
}
// The poster is a frame of the real app in 3D.
await renderStill({ composition, serveUrl, browserExecutable, frame: 450, imageFormat: "jpeg", jpegQuality: 82, output: path.join(outDir, "recharge-different-poster.jpg") });
console.log("done", outDir);
