import { heading, homeBySlug } from "./properties";

// Real listing photos chosen for large page images. Each one links back to its home.
function pick(slug: string, photo: number) {
  const home = homeBySlug(slug);
  const src = home?.photos[photo]?.src;
  if (!home || !src) return null;
  return { src, href: `/properties/${home.slug}`, caption: `${heading(home)}, ${home.region}` };
}

export const showcase = {
  stayHero: pick("1-bedroom-home-in-edinburgh-4", 1),
  ownerHero: pick("2-bedroom-home-in-edinburgh-3", 2),
  checked: pick("2-bedroom-home-in-livingston-2", 0),
  families: pick("3-bedroom-home-in-edinburgh-4", 1),
  contractors: pick("3-bedroom-home-in-edinburgh-5", 0),
  business: pick("1-bedroom-home-in-edinburgh-2", 0),
  longStays: pick("2-bedroom-home-in-aberdeen", 0),
  homeHero: [pick("3-bedroom-home-in-edinburgh-4", 1), pick("1-bedroom-home-in-edinburgh-4", 0), pick("2-bedroom-home-in-livingston-4", 0)],
  // A freshly made bed with rolled towels, and a front door: a stay that is ready, and a home that is looked after.
  guests: pick("2-bedroom-home-in-livingston-4", 18),
  owners: pick("2-bedroom-home-in-livingston-4", 12),
  supportHero: pick("2-bedroom-home-in-edinburgh-3", 8),
  aboutHero: pick("3-bedroom-home-in-edinburgh-2", 0),
};
export type Shot = NonNullable<ReturnType<typeof pick>>;
