import { Html5Audio, Sequence, staticFile, useVideoConfig } from "remotion";

/* A sound effect that starts at `at` seconds. */
export function Sfx({ at, name, volume = 0.5 }: { at: number; name: string; volume?: number }) {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps))} layout="none" name={`sfx ${name}`}>
      <Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
}
