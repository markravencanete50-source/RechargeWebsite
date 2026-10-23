import { heading, homeBySlug } from "./properties";

// A photo for a large page image. Photos of our homes link back to the home; the image pack's stock and place photos have no
// link. `alt` is the description where it differs from the caption, and `position` steers the crop.
export type Shot = { src: string; caption: string; href?: string; alt?: string; position?: string };

// Real listing photos chosen for large page images. Each one links back to its home.
function pick(slug: string, photo: number): Shot | null {
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
  kitchen: pick("1-bedroom-home-in-edinburgh-2", 7),
};

// The Recharge image pack (public/images/recharge, credits in docs/images/LICENSES-AND-CREDITS.md). Home photos name the home
// they come from; stock and place photos are illustrations and never stand for a named home, guest or member of the team.
type PackImage = { src: string; width: number; height: number; alt: string; home?: string; credit?: string };
export const pack = {
  R01: { src: "/images/recharge/home/r01-edinburgh-living-room.webp", width: 1350, height: 900, alt: "Living and dining room with a blue sofa in a Recharge home in Edinburgh.", home: "3-bedroom-home-in-edinburgh-4" },
  R02: { src: "/images/recharge/stay/r02-sofa-and-fireplace.webp", width: 1280, height: 960, alt: "Grey corner sofa beside a fireplace in a Recharge home.", home: "1-bedroom-home-in-edinburgh-4" },
  R03: { src: "/images/recharge/stay/r03-edinburgh-bedroom.webp", width: 1280, height: 960, alt: "Double bed with green cushions and a folded throw in a Recharge Edinburgh home.", home: "1-bedroom-home-in-edinburgh-2" },
  R04: { src: "/images/recharge/stay/r04-edinburgh-bathroom.webp", width: 1350, height: 900, alt: "Bright bathroom with a shower and wide vanity in a Recharge Edinburgh home.", home: "1-bedroom-home-in-edinburgh-2" },
  R05: { src: "/images/recharge/owners/r05-livingston-bedroom.webp", width: 1350, height: 900, alt: "Furnished bedroom with a blue throw and reading lights in a Recharge Livingston home.", home: "2-bedroom-home-in-livingston-2" },
  R06: { src: "/images/recharge/stay/r06-edinburgh-kitchen-living.webp", width: 1280, height: 960, alt: "Kitchen and seating area in a Recharge Edinburgh home.", home: "1-bedroom-home-in-edinburgh-2" },
  R07: { src: "/images/recharge/owners/r07-edinburgh-dining-room.webp", width: 1350, height: 900, alt: "Dining table beside a bay window and fireplace in a Recharge Edinburgh home.", home: "2-bedroom-home-in-edinburgh-3" },
  R08: { src: "/images/recharge/stay/r08-livingston-dining.webp", width: 1350, height: 900, alt: "Dining table and colourful armchair in a Recharge Livingston home.", home: "2-bedroom-home-in-livingston-4" },
  R09: { src: "/images/recharge/stay/r09-glasgow-kitchen.webp", width: 1350, height: 900, alt: "Kitchen with an oven, washing machine and white cabinets in a Recharge Glasgow home.", home: "2-bedroom-home-in-glasgow-3" },
  R10: { src: "/images/recharge/stay/r10-glasgow-tea-coffee.webp", width: 1612, height: 900, alt: "Tea, coffee and sugar canisters on the counter in a Recharge Glasgow home.", home: "3-bedroom-home-in-glasgow" },
  S01: { src: "/images/recharge/app/s01-housekeeping.webp", width: 1280, height: 1920, alt: "Housekeeper preparing a bed in a bright bedroom.", credit: "Liliana Drew" },
  S02: { src: "/images/recharge/app/s02-radiator-repair.webp", width: 1920, height: 1280, alt: "Close-up of a tradesperson fitting a radiator pipe.", credit: "Sergei Starostin" },
  S03: { src: "/images/recharge/support/s03-customer-support.webp", width: 1920, height: 1280, alt: "Support agent wearing a headset while working on a laptop.", credit: "MART PRODUCTION" },
  S04: { src: "/images/recharge/stay/s04-family-together.webp", width: 1920, height: 1281, alt: "Family spending time together on a sofa.", credit: "August de Richelieu" },
  S05: { src: "/images/recharge/about/s05-moving-home.webp", width: 1280, height: 1920, alt: "Woman arranging cardboard boxes during a house move.", credit: "SHVETS production" },
  S06: { src: "/images/recharge/stay/s06-working-from-home.webp", width: 1280, height: 1920, alt: "Two people working together on a laptop at a kitchen counter.", credit: "Ron Lach" },
  S07: { src: "/images/recharge/stay/s07-arrival-keys.webp", width: 1920, height: 1281, alt: "Hand holding a set of house keys inside an apartment.", credit: "Jakub Zerdzicki" },
  L01: { src: "/images/recharge/locations/glasgow/l01-glasgow.webp", width: 1280, height: 1920, alt: "Clyde Arc bridge and the River Clyde in Glasgow at sunset.", credit: "Sonny Vermeer" },
  L02: { src: "/images/recharge/locations/edinburgh/l02-edinburgh.webp", width: 1920, height: 1278, alt: "View across Edinburgh rooftops beneath a cloudy sky.", credit: "Oleksiy Yeshtokyn" },
  L03: { src: "/images/recharge/locations/aberdeen/l03-aberdeen.webp", width: 1920, height: 1440, alt: "Green park and historic buildings in Aberdeen.", credit: "Dan Wright" },
  L04: { src: "/images/recharge/locations/dunbartonshire/l04-loch-lomond.webp", width: 1280, height: 1920, alt: "Misty hills reflected in Loch Lomond, Scotland.", credit: "Laura Meinhardt" },
  L05: { src: "/images/recharge/locations/inverness-and-highlands/l05-skye.webp", width: 1920, height: 1440, alt: "The Quiraing landscape on the Isle of Skye.", credit: "Vincent Delsuc" },
  L06: { src: "/images/recharge/locations/dundee/l06-dundee.webp", width: 1920, height: 1280, alt: "V&A Dundee beside the River Tay.", credit: "Radu Daniel ( MRD )" },
  L07: { src: "/images/recharge/locations/fife/l07-fife.webp", width: 1920, height: 1177, alt: "Aerial view of St Andrews Castle on the Fife coast.", credit: "Valentine Kulikov" },
  L08: { src: "/images/recharge/locations/stirling-and-falkirk/l08-stirling.webp", width: 1275, height: 1920, alt: "View over Stirling from the castle walls.", credit: "Himalay Patel" },
} satisfies Record<string, PackImage>;

export function packShot(id: keyof typeof pack, position?: string): Shot {
  const img: PackImage = pack[id];
  const home = img.home ? homeBySlug(img.home) : undefined;
  return home
    ? { src: img.src, alt: img.alt, href: `/properties/${home.slug}`, caption: `${heading(home)}, ${home.region}`, position }
    : { src: img.src, alt: img.alt, caption: img.alt, position };
}

// Areas with a photo of the place itself in the image pack. The other areas keep a photo of one of our homes there.
export const regionPhotos: Record<string, Shot> = {
  Glasgow: packShot("L01", "50% 40%"),
  Edinburgh: packShot("L02"),
  Aberdeen: packShot("L03"),
  Dunbartonshire: packShot("L04", "50% 45%"),
  "Inverness and Highlands": packShot("L05"),
  Dundee: packShot("L06"),
  Fife: packShot("L07"),
  "Stirling and Falkirk": packShot("L08", "50% 60%"),
};

// Areas whose best-reviewed home opens its gallery with a floor plan or a detail shot get a chosen room instead, on the area
// cards and the area page.
export const areaCovers: Record<string, Shot | null> = {
  "Scottish Borders": pick("2-bedroom-home-in-hawick-7", 2),
};
