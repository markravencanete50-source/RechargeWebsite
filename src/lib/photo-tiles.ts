// Hostaway listings carry a few branded tiles (a logo on a flat teal ground) next to the photos of the home. The import leaves
// them out (scripts/import-properties.mjs, isTile); this is the same test, for photos that appear in Hostaway after an import.
import sharp from "sharp";

export async function isTile(url: string): Promise<boolean> {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000), cache: "no-store" });
  if (!res.ok) return true; // a photo that cannot be fetched is not shown either
  const { data } = await sharp(Buffer.from(await res.arrayBuffer())).resize(200, 200, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let teal = 0;
  for (let i = 0; i < data.length; i += 3) if (data[i + 1] - data[i] > 35 && Math.abs(data[i + 1] - data[i + 2]) < 25 && data[i] < 120) teal++;
  return teal / (data.length / 3) > 0.4;
}
