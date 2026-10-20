import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { DURATION, Film, FPS } from "./Film";

// Montserrat, bundled, so the render never depends on a network font.
const fontsReady = delayRender("Loading Montserrat");
Promise.all([["500", "Montserrat_500Medium.ttf"], ["600", "Montserrat_600SemiBold.ttf"]].map(([weight, file]) => new FontFace("Montserrat", `url(${staticFile(`fonts/${file}`)})`, { weight }).load()))
  .then((faces) => { faces.forEach((face) => document.fonts.add(face)); continueRender(fontsReady); })
  .catch(() => continueRender(fontsReady));

export function Root() {
  return <Composition id="different" component={Film} fps={FPS} durationInFrames={DURATION} width={1920} height={1080} />;
}
