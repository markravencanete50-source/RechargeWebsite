// Finding a real photograph of a named place on Wikipedia. Shared by the build script
// (scripts/place-photos.mjs) and the property page, which looks up any place the script has not.

export type PlacePhoto = { src: string; page: string; credit?: string };

const API = "https://en.wikipedia.org/w/api.php";

// Names that describe a kind of place rather than one place: no photo would be honest.
const GENERIC = /^(the )?(local |nearest |nearby )?(gym|gyms|supermarkets?|train station|bus stops?|shops?|shopping|town centre|city centre|city center|quick bites|steps away|commuter friendly|stress-free parking|edinburgh|glasgow|aberdeen|dundee|airport)\b/i;
const STOP = new Set(["the", "and", "park", "centre", "center", "station", "shopping"]);

// Shops and supermarkets match articles about the chain, not the branch nearby.
const CHAIN = /\b(supermarkets?|superstore|tesco|aldi|lidl|asda|morrisons|sainsbury'?s|co-?op|gym group|puregym|jd gyms|shopping centre|shopping park|retail park|outlet|business park)\b/i;

export const wantsPhoto = (name: string) => name.length >= 4 && !GENERIC.test(name) && !CHAIN.test(name);

const words = (s: string) => s.toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w));

const url = (params: Record<string, string>) => `${API}?${new URLSearchParams({ format: "json", formatversion: "2", origin: "*", ...params })}`;

export const searchUrl = (name: string, town: string) =>
  url({ action: "query", generator: "search", gsrsearch: `${name.split("/")[0]} ${town} Scotland`, gsrlimit: "5", prop: "pageimages|info", piprop: "thumbnail|name", pithumbsize: "640", inprop: "url" });

export const fileUrl = (file: string) => url({ action: "query", titles: `File:${file}`, prop: "imageinfo", iiprop: "extmetadata" });

type Page = { index: number; title: string; fullurl: string; pageimage?: string; thumbnail?: { source: string } };

// Words that say what kind of place it is. A station must match a station, not a battle.
const KIND = new Set(["station", "stadium", "castle", "hospital", "museum", "palace", "university"]);

// True when a Wikipedia title clearly names the same place: most of the name's words are in
// the title, the title adds at most one word of its own, and the kind of place agrees.
export function isSamePlace(name: string, title: string) {
  const want = words(name.split("/")[0]);
  const have = words(title);
  if (!want.length) return false;
  const shared = want.filter((w) => have.includes(w)).length;
  const extra = have.filter((w) => !want.includes(w) && w !== "railway" && w !== "scotland").length;
  const allName = name.toLowerCase().split(/[^a-z]+/);
  const allTitle = title.toLowerCase().split(/[^a-z]+/);
  const kindsAgree = [...KIND].every((k) => allName.includes(k) === allTitle.includes(k));
  return shared / want.length >= 0.6 && extra <= 1 && kindsAgree;
}

// The first result that is clearly the same place, and which has a photo.
export function pickPage(data: { query?: { pages?: Page[] } }, name: string): Page | null {
  const pages = [...(data.query?.pages ?? [])].sort((a, b) => a.index - b.index);
  return pages.find((p) => p.thumbnail && p.pageimage && isSamePlace(name, p.title)) ?? null;
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
