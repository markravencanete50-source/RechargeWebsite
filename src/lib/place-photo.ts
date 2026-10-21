// Finding a real photograph of a named place on Wikipedia. Shared by the build script
// (scripts/place-photos.mjs) and the property page, which looks up any place the script has not.

export type PlacePhoto = { src: string; page: string; credit?: string };

const API = "https://en.wikipedia.org/w/api.php";

// Names that describe a kind of place rather than one place: no photo would be honest.
const GENERIC = /^(the )?(local |nearest |nearby )?(gym|gyms|supermarkets?|train station|bus stops?|shops?|shopping|town centre|city centre|city center|quick bites|steps away|commuter friendly|stress-free parking|edinburgh|glasgow|aberdeen|dundee|airport)\b/i;
const STOP = new Set(["the", "and", "park", "centre", "center", "station", "shopping"]);

export const wantsPhoto = (name: string) => name.length >= 4 && !GENERIC.test(name);

const words = (s: string) => s.toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w));

const url = (params: Record<string, string>) => `${API}?${new URLSearchParams({ format: "json", formatversion: "2", origin: "*", ...params })}`;

export const searchUrl = (name: string, town: string) =>
  url({ action: "query", generator: "search", gsrsearch: `${name.split("/")[0]} ${town} Scotland`, gsrlimit: "5", prop: "pageimages|info", piprop: "thumbnail|name", pithumbsize: "640", inprop: "url" });

export const fileUrl = (file: string) => url({ action: "query", titles: `File:${file}`, prop: "imageinfo", iiprop: "extmetadata" });

type Page = { index: number; title: string; fullurl: string; pageimage?: string; thumbnail?: { source: string } };

// The first result whose title clearly names the same place, and which has a photo.
export function pickPage(data: { query?: { pages?: Page[] } }, name: string): Page | null {
  const want = words(name.split("/")[0]);
  if (!want.length) return null;
  const pages = [...(data.query?.pages ?? [])].sort((a, b) => a.index - b.index);
  for (const p of pages) {
    if (!p.thumbnail || !p.pageimage) continue;
    const have = new Set(words(p.title));
    if (want.filter((w) => have.has(w)).length / want.length >= 0.6) return p;
  }
  return null;
}

const strip = (html = "") => html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

export function credit(info: { query?: { pages?: { imageinfo?: { extmetadata?: Record<string, { value?: string }> }[] }[] } }) {
  const meta = info.query?.pages?.[0]?.imageinfo?.[0]?.extmetadata ?? {};
  return [strip(meta.Artist?.value).slice(0, 60), strip(meta.LicenseShortName?.value), "Wikimedia Commons"].filter(Boolean).join(", ");
}

// Looks one place up. Returns null when nothing clearly matches.
export async function findPlacePhoto(name: string, town: string, get: (u: string) => Promise<unknown> = (u) => fetch(u).then((r) => r.json())): Promise<PlacePhoto | null> {
  if (!wantsPhoto(name)) return null;
  const page = pickPage((await get(searchUrl(name, town))) as Parameters<typeof pickPage>[0], name);
  if (!page) return null;
  let by = "Wikimedia Commons";
  try { by = credit((await get(fileUrl(page.pageimage!))) as Parameters<typeof credit>[0]); } catch {}
  return { src: page.thumbnail!.source, page: page.fullurl, credit: by };
}
