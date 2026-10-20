// Render the "why we are different" film and its poster into the website's public/video folder.
// Usage: npm run render
import path from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "..", "public", "video");
mkdirSync(outDir, { recursive: true });
// Use a local Chromium when one is installed; otherwise Remotion downloads its own.
const browserExecutable = [process.env.REMOTION_BROWSER, "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"].find((p) => p && existsSync(p)) ?? null;
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const composition = await selectComposition({ serveUrl, id: "different", browserExecutable });

if (!process.argv.includes("--poster-only")) {
  await renderMedia({
    composition, serveUrl, browserExecutable, codec: "h264", crf: 22, pixelFormat: "yuv420p", muted: true,
    outputLocation: path.join(outDir, "recharge-different.mp4"),
    onProgress: ({ progress }) => process.stdout.write(`\rfilm: ${Math.round(progress * 100)}%   `),
  });
  console.log();
}
// The poster is a frame from the first role scene: the app on a phone.
await renderStill({ composition, serveUrl, browserExecutable, frame: 300, imageFormat: "jpeg", jpegQuality: 82, output: path.join(outDir, "recharge-different-poster.jpg") });
console.log("done", outDir);
