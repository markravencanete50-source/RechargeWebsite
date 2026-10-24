// Collections of homes, each a filtered view of All homes picked from the listings by a simple rule, so a home joins or leaves a
// collection as soon as its listing changes.
import type { Faq } from "./faqs";
import { tags, type Home } from "./home-utils";

export type Collection = {
  slug: string; label: string; title: string; lead: string; search: string; test: (h: Home) => boolean;
  intro: string[]; faqs: (homes: Home[]) => Faq[];
};

const freeParking = (h: Home) => tags(h).includes("Free parking") || h.amenities.some((a) => /free parking|free street parking/i.test(a));
const central = (h: Home) => tags(h).some((t) => t === "City centre" || t === "Central");
const most = (homes: Home[]) => Math.max(0, ...homes.map((h) => h.guests ?? 0));
const fewest = (homes: Home[]) => Math.min(...homes.map((h) => h.guests ?? 99));
// Where a collection's homes are, largest area first, as "Edinburgh (8), West Lothian (8) and Glasgow (4)".
const areas = (homes: Home[], n = 3) => {
  const c = new Map<string, number>();
  for (const h of homes) c.set(h.region, (c.get(h.region) ?? 0) + 1);
  const top = [...c].sort((a, b) => b[1] - a[1]).slice(0, n).map(([r, k]) => `${r} (${k})`);
  return top.length > 1 ? `${top.slice(0, -1).join(", ")} and ${top[top.length - 1]}` : top[0] ?? "";
};

export const collections: Collection[] = [
  {
    slug: "one-bedroom", label: "1-bedroom homes", title: "One-bedroom homes", search: "/properties",
    lead: "A flat of your own for one or two, with a kitchen and space to relax, instead of a hotel room.",
    test: (h) => h.bedrooms === 1,
    intro: ["Right for a work trip, a couple's break or a longer stay on your own.", "Every home is cleaned and checked before you arrive, with fresh linen and towels."],
    faqs: (hs) => [
      { q: "How many people can stay in a one-bedroom home?", a: `Between ${fewest(hs)} and ${most(hs)}, depending on the home. Some add a sofa bed in the living room. Each home's page shows the beds in every room.` },
      { q: "Is a one-bedroom home good for a work trip?", a: "Yes. You get a kitchen, wifi in most homes and a real person on the phone at any hour." },
    ],
  },
  {
    slug: "two-bedroom", label: "2-bedroom homes", title: "Two-bedroom homes", search: "/properties?beds=2",
    lead: "Room for a family, two couples or a small crew, with a bedroom each for two of you.",
    test: (h) => h.bedrooms === 2,
    intro: ["Our most common size of home, in most of the areas we cover.", "Each home's page lists the beds room by room, so you can see who sleeps where."],
    faqs: (hs) => [
      { q: "How many people can a two-bedroom home sleep?", a: `Between ${fewest(hs)} and ${most(hs)}, depending on the home. Each home's page shows the beds in every room.` },
      { q: "Do two-bedroom homes have parking?", a: `${hs.filter((h) => h.amenities.some((a) => /parking/i.test(a))).length} of them list parking. Each home's page says whether it is free, private or on the street.` },
    ],
  },
  {
    slug: "three-bedrooms-plus", label: "3 bedrooms or more", title: "Homes with three bedrooms or more", search: "/properties?beds=3",
    lead: "Whole houses and large flats for families, groups and contractor crews.",
    test: (h) => h.bedrooms >= 3,
    intro: ["A bedroom for each person on a crew, or for each family on a shared holiday.", "Most have a full kitchen and a washing machine."],
    faqs: (hs) => [
      { q: "What is your biggest home?", a: `Our largest homes sleep ${most(hs)}. Set the number of guests in the search to see every home that fits your group.` },
      { q: "Can contractors book these homes?", a: "Yes. Weekly and monthly stays are welcome, and many homes offer a long-stay discount on request." },
    ],
  },
  {
    slug: "large-groups", label: "Homes for groups", title: "Homes for six or more", search: "/properties?guests=6",
    lead: "Every home that sleeps six or more, so a family or a group can stay together under one roof.",
    test: (h) => (h.guests ?? 0) >= 6,
    intro: ["A table to eat round, a kitchen for everyone, and bedrooms listed room by room so you can plan who sleeps where.", "Parties are not allowed in any of our homes. Groups are welcome; noise late at night is not."],
    faqs: (hs) => [
      { q: "What is the most guests a home can sleep?", a: `${most(hs)}. Each home's page lists the beds in every room.` },
      { q: "Can we have a party?", a: "No. Our house rules do not allow parties or loud music, so the homes stay good for guests and neighbours." },
    ],
  },
  {
    slug: "free-parking", label: "Free parking", title: "Homes with free parking", search: "/properties",
    lead: "Homes where the listing says parking is free, on the property or on the street.",
    test: freeParking,
    intro: ["Useful for road trips, contractors with vans and families with luggage.", "Each home's page says where to park and whether the space is private or on the street."],
    faqs: () => [
      { q: "Is the parking guaranteed?", a: "Private spaces are. Free street parking depends on what is free when you arrive. Each home's page says which it is." },
      { q: "Do other homes have parking?", a: "Yes. More homes list paid or street parking. Each home's page shows its parking under What this home offers." },
    ],
  },
  {
    slug: "city-centre", label: "City centre", title: "Central homes", search: "/properties",
    lead: "Homes whose listing describes them as central or in the city centre, close to shops, food and transport.",
    test: central,
    intro: ["Walk to restaurants, offices and stations instead of driving.", "Central homes are often flats in shared buildings, so quiet hours matter to the neighbours."],
    faqs: (hs) => [
      { q: "Do central homes have parking?", a: "Some do. Each home's page shows its parking under What this home offers." },
      { q: "Where are these homes?", a: `The most are in ${areas(hs)}. The list above shows each home's area.` },
    ],
  },
];

export const collection = (slug: string) => collections.find((c) => c.slug === slug);
