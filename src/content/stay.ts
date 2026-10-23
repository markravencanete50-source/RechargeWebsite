// Facts for the Stays pages, worked out from the homes we run each time the catalogue refreshes, so the numbers on the pages
// always match the listings.
import type { Home } from "./home-utils";
import { parseListing } from "./listing";

const share = (homes: Home[], test: (h: Home) => boolean) => homes.filter(test).length;
const hasAmenity = (re: RegExp) => (h: Home) => h.amenities.some((a) => re.test(a));

// The most common value in a list, and how many homes differ from it.
export function usual(values: (string | undefined)[]) {
  const tally = new Map<string, number>();
  for (const v of values) if (v) tally.set(v, (tally.get(v) ?? 0) + 1);
  const [value = "", n = 0] = [...tally].sort((a, b) => b[1] - a[1])[0] ?? [];
  return { value, others: values.length - n };
}

export type Fact = { title: string; note: string; count: number };

// What the homes have, most common first. Only lines at least one home has are kept.
export function homeFacts(homes: Home[]): Fact[] {
  const rows: [string, string, RegExp][] = [
    ["Fresh linen and towels", "Beds made up before you arrive", /linen|towel|essentials/i],
    ["A kitchen", "Most with an oven, microwave and kettle", /kitchen/i],
    ["Heating and hot water", "Whatever the weather", /heating/i],
    ["Suitable for children", "Check the beds in each room", /child|famil/i],
    ["A washing machine", "Handy for longer stays", /washing machine|washer/i],
    ["Wifi", "Details come with your check-in information", /wi-?fi|wireless|internet/i],
    ["Parking", "Free, private or on the street", /parking/i],
  ];
  return rows.map(([title, note, re]) => ({ title, note, count: share(homes, hasAmenity(re)) })).filter((f) => f.count > 0).sort((a, b) => b.count - a.count);
}

// Safety equipment, counted the same way.
export function safetyFacts(homes: Home[]): Fact[] {
  const rows: [string, string, RegExp][] = [
    ["Smoke alarm", "Listed on the home's page", /smoke/i],
    ["Carbon monoxide alarm", "Listed on the home's page", /carbon monoxide/i],
    ["Fire extinguisher", "Listed on the home's page", /extinguisher/i],
    ["First aid kit", "Listed on the home's page", /first aid/i],
  ];
  return rows.map(([title, note, re]) => ({ title, note, count: share(homes, hasAmenity(re)) })).filter((f) => f.count > 0);
}

// Things fewer homes have, for guests looking for something in particular.
export function extraFacts(homes: Home[]): Fact[] {
  const rows: [string, string, RegExp][] = [
    ["Free parking", "On the property or on the street, at no charge", /free parking|free street/i],
    ["Suitable for infants", "Check the beds in each room", /infant/i],
    ["A desk or workspace", "For work trips", /workspace|desk/i],
    ["A dishwasher", "Fewer dishes to do", /dishwasher/i],
    ["A garden", "Outdoor space of your own", /garden|backyard/i],
  ];
  return rows.map(([title, note, re]) => ({ title, note, count: share(homes, hasAmenity(re)) })).filter((f) => f.count > 0).sort((a, b) => b.count - a.count);
}

// House rules, grouped across every listing.
export function houseRules(homes: Home[]) {
  const rules = homes.map((h) => parseListing(h.description, h.houseRules).rules.join(" "));
  const count = (re: RegExp) => rules.filter((r) => re.test(r)).length;
  return {
    total: homes.length,
    parties: count(/part(y|ies)|events?|loud music/i),
    smoking: count(/smok|vap/i),
    damage: count(/damage|mess/i),
    id: count(/\bid\b|registration|verif|pre-?arrival form|check-in form/i),
    pets: count(/\bpets?\b/i),
    longStay: homes.filter((h) => parseListing(h.description, h.houseRules).longStay).length,
  };
}

export type Trip = { id: string; title: string; lead: string; points: string[]; href: string; cta: string; homes: Home[]; count: number };

// The kinds of trip our homes suit, each with the homes that fit it best and a search that finds the rest.
export function trips(homes: Home[]): Trip[] {
  const parking = hasAmenity(/parking/i);
  const wifi = hasAmenity(/wi-?fi|wireless|internet/i);
  const washer = hasAmenity(/washing machine|washer/i);
  const big = homes.filter((h) => (h.guests ?? 0) >= 6);
  const crews = homes.filter((h) => h.bedrooms >= 3 && parking(h));
  const work = homes.filter((h) => h.bedrooms <= 2 && wifi(h) && /edinburgh|glasgow/i.test(h.region));
  const long = homes.filter((h) => parseListing(h.description, h.houseRules).longStay && washer(h));
  // The best-reviewed homes for each trip, without repeating a home another trip already shows when there are others to pick.
  const shown = new Set<string>();
  const byReviews = (list: Home[]) => {
    const sorted = [...list].sort((a, b) => b.reviews - a.reviews);
    const picks = [...sorted.filter((h) => !shown.has(h.slug)), ...sorted.filter((h) => shown.has(h.slug))];
    for (const h of picks.slice(0, 4)) shown.add(h.slug);
    return picks;
  };
  return [
    {
      id: "families", title: "Families and groups", count: big.length, homes: byReviews(big).slice(0, 4),
      lead: "A whole home means room for everyone, a table to eat round and a kitchen for the children's meals.",
      points: [`${big.length} homes sleep six or more`, "Bedrooms and beds listed room by room, so you can plan who sleeps where", "Most homes are listed as suitable for children"],
      href: "/properties?guests=6", cta: "Homes for 6 or more",
    },
    {
      id: "contractors", title: "Contractors and crews", count: crews.length, homes: byReviews(crews).slice(0, 4),
      lead: "Separate bedrooms for each person on the crew, parking for the vans, and a kitchen and washing machine for the working week.",
      points: [`${crews.length} homes have three or more bedrooms and parking`, "Weekly and monthly stays welcome", "A kitchen and washing machine in most homes"],
      href: "/properties?beds=3", cta: "3 bedrooms or more",
    },
    {
      id: "business", title: "Business travel", count: work.length, homes: byReviews(work).slice(0, 4),
      lead: "A quiet flat close to the centre, with wifi and a proper kitchen, instead of a hotel room.",
      points: [`${work.length} one and two-bedroom homes with wifi in Edinburgh and Glasgow`, "Let yourself in with the details we send before you arrive", "A real person on the phone, day and night"],
      href: "/properties?area=Edinburgh", cta: "Homes in Edinburgh",
    },
    {
      id: "long-stays", title: "Longer stays", count: long.length, homes: byReviews(long).slice(0, 4),
      lead: "For a relocation, a renovation, an insurance claim or the weeks between selling and buying.",
      points: [`${long.length} homes allow long stays and have a washing machine`, "Long-stay discounts on request", "Tell us your dates and we price the whole stay"],
      href: "/properties", cta: "See every home",
    },
  ];
}
