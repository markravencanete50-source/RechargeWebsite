import { AbsoluteFill, Html5Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Sfx } from "./components/Sfx";
import { StepTracker } from "./components/StepTracker";
import { AT, Book, Brand, Clean, Cta, Fix, Hook, Owners, Support } from "./scenes/Scenes";
import { C } from "./theme";
import { CUT, LINES, T } from "./timeline";

/*
  The Recharge advertisement, built the same way as the Medville Diabetes ad: the voice leads, every
  scene is timed against it, B-roll and the real product carry the story, captions follow the voice,
  and every action has its sound. Music sits under the voice and lifts in the gaps.
*/
export function Ad() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const musicVolume = (f: number) => {
    const s = f / fps;
    const speaking = LINES.some((l) => s > l.start - 0.15 && s < l.end + 0.1);
    const near = LINES.reduce((m, l) => Math.min(m, Math.max(0, l.start - 0.15 - s, s - l.end - 0.1)), 9);
    return speaking ? 0.08 : interpolate(near, [0, 0.35], [0.11, 0.32], { extrapolateRight: "clamp" });
  };
  const H = T / 2;
  return (
    <AbsoluteFill style={{ background: C.abyss }}>
      <Hook t={t} />
      <Brand t={t} />
      <Book t={t} />
      <Clean t={t} />
      <Fix t={t} />
      <Owners t={t} />
      <Support t={t} />
      <Cta t={t} />
      <StepTracker t={t} />
      <Captions />

      <Html5Audio src={staticFile("voiceover.wav")} volume={1} />
      <Html5Audio src={staticFile("music.wav")} volume={musicVolume} />

      {AT.hookCards.map((at) => <Sfx key={at} at={at} name="pop" volume={0.28} />)}
      <Sfx at={CUT.brand - H} name="whoosh-up" volume={0.35} />
      <Sfx at={AT.logo} name="impact" volume={0.4} />
      {AT.pins.map((at) => <Sfx key={at} at={at} name="pop" volume={0.25} />)}
      <Sfx at={CUT.book - H} name="whoosh-up" volume={0.35} />
      <Sfx at={AT.clickArea} name="click" volume={0.5} />
      <Sfx at={AT.clickArea + 0.1} name="typing" volume={0.25} />
      <Sfx at={AT.clickSearch} name="click" volume={0.5} />
      <Sfx at={AT.badge} name="stamp" volume={0.45} />
      <Sfx at={CUT.clean - H} name="whoosh-short" volume={0.35} />
      <Sfx at={AT.cleanCard} name="pop" volume={0.25} />
      {AT.ticks.map((at) => <Sfx key={at} at={at} name="tap" volume={0.35} />)}
      <Sfx at={AT.flash} name="click" volume={0.45} />
      <Sfx at={AT.flash + 0.2} name="chime" volume={0.2} />
      <Sfx at={CUT.fix - H} name="whoosh-up" volume={0.3} />
      <Sfx at={AT.fixSteps[0]} name="click" volume={0.45} />
      <Sfx at={AT.fixSteps[1]} name="pop" volume={0.28} />
      <Sfx at={AT.fixSteps[2]} name="stamp" volume={0.5} />
      <Sfx at={AT.ready} name="chime" volume={0.25} />
      <Sfx at={CUT.owners - H} name="whoosh-short" volume={0.3} />
      {AT.ownerCards.map((at) => <Sfx key={at} at={at} name="pop" volume={0.28} />)}
      <Sfx at={AT.ownerPhone - 0.2} name="whoosh-short" volume={0.2} />
      <Sfx at={CUT.support - H} name="whoosh-short" volume={0.35} />
      {AT.chat.map((at) => <Sfx key={at} at={at} name="pop" volume={0.28} />)}
      <Sfx at={AT.allDay} name="impact" volume={0.3} />
      <Sfx at={CUT.cta - H} name="whoosh-up" volume={0.4} />
      <Sfx at={AT.endLogo} name="impact" volume={0.45} />
      <Sfx at={AT.endClick} name="click" volume={0.55} />
      <Sfx at={AT.endClick + 0.02} name="chime" volume={0.25} />
    </AbsoluteFill>
  );
}
