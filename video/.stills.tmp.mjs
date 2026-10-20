import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
const root = process.cwd(); const out = process.argv[2];
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const composition = await selectComposition({ serveUrl, id: "different", browserExecutable });
for (const s of process.argv.slice(3).map(Number)) await renderStill({ composition, serveUrl, browserExecutable, frame: Math.round(s * 60), scale: 0.5, output: `${out}/s${s}.png` });
console.log("ok");
