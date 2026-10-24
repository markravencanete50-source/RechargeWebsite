// Facts for the Properties guides, worked out from the homes we run each time the catalogue refreshes, so every number on
// those pages matches the listings.
import type { Fact } from "./stay";
import type { Home } from "./home-utils";
import { tags } from "./home-utils";
import { parseListing } from "./listing";

const share = (homes: Home[], test: (h: Home) => boolean) => homes.filter(test).length;
const hasAmenity = (re: RegExp) => (h: Home) => h.amenities.some((a) => re.test(a));
const says = (re: RegExp) => (h: Home) => re.test(h.description ?? "");
const median = (ns: number[]) => {
  const s = [...ns].sort((a, b) => a - b);
  return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : Math.round((s[s.length / 2 - 1] + s[s.length / 2]) / 2)) : 0;
};

// Homes grouped by number of bedrooms, with how many each sleeps and what a night typically costs.
export type SizeRow = { label: string; bedrooms: number; count: number; sleeps: [number, number]; from: number; typical: number; to: number; href: string };
const SIZES: { label: string; test: (b: number) => boolean; bedrooms: number; href: string }[] = [
  { label: "1 bedroom", test: (b) => b <= 1, bedrooms: 1, href: "/properties/collection/one-bedroom" },
  { label: "2 bedrooms", test: (b) => b === 2, bedrooms: 2, href: "/properties/collection/two-bedroom" },
  { label: "3 bedrooms", test: (b) => b === 3, bedrooms: 3, href: "/properties/collection/three-bedrooms-plus" },
  { label: "4 bedrooms or more", test: (b) => b >= 4, bedrooms: 4, href: "/properties/collection/three-bedrooms-plus" },
];
export function sizes(homes: Home[]): SizeRow[] {
  return SIZES.map((s) => {
    const hs = homes.filter((h) => s.test(h.bedrooms));
    const guests = hs.map((h) => h.guests ?? 0).filter(Boolean);
    const prices = hs.map((h) => h.price ?? 0).filter(Boolean);
    return {
      label: s.label, bedrooms: s.bedrooms, count: hs.length, href: s.href,
      sleeps: [Math.min(...guests), Math.max(...guests)] as [number, number],
      from: Math.min(...prices), typical: median(prices), to: Math.max(...prices),
    };
  }).filter((r) => r.count > 0);
}

// What a guest can count on when choosing a size.
export function layoutFacts(homes: Home[]) {
  return {
    total: homes.length,
    moreThanTwoPerRoom: share(homes, (h) => (h.guests ?? 0) > h.bedrooms * 2),
    sofaBed: share(homes, says(/sofa ?bed/i)),
    oneBath: share(homes, (h) => (h.bathrooms ?? 1) < 2),
    twoBaths: share(homes, (h) => (h.bathrooms ?? 0) >= 2),
    sixPlus: share(homes, (h) => (h.guests ?? 0) >= 6),
    most: Math.max(0, ...homes.map((h) => h.guests ?? 0)),
    // Homes whose page lists the beds in each bedroom, under Where you will sleep.
    roomByRoom: share(homes, (h) => parseListing(h.description, h.houseRules).rooms.some((r) => r.kind === "bedroom" || r.sleeps)),
  };
}

// Parking, as each home lists it.
export function parkingFacts(homes: Home[]): Fact[] {
  const rows: [string, string, (h: Home) => boolean][] = [
    ["Free parking", "On the property or on the street, at no charge", (h) => tags(h).includes("Free parking") || hasAmenity(/free parking|free street/i)(h)],
    ["Street parking", "On the street outside or nearby", hasAmenity(/street parking/i)],
    ["Private parking", "A space that belongs to the home", hasAmenity(/private parking/i)],
    ["Paid parking", "On the property or nearby, at a charge", hasAmenity(/paid parking/i)],
  ];
  return rows.map(([title, note, test]) => ({ title, note, count: share(homes, test) })).filter((f) => f.count > 0);
}

// Getting there without a car, counted from what each listing says about its location.
export function transportFacts(homes: Home[]): Fact[] {
  const rows: [string, string, (h: Home) => boolean][] = [
    ["A train station", "Named in the home's description", says(/\btrain\b|railway/i)],
    ["An airport", "Named in the home's description", says(/airport/i)],
    ["A bus route", "Named in the home's description", says(/\bbus(es)?\b/i)],
    ["In or near the centre", "City centre or central, in the home's details", (h) => tags(h).some((t) => t === "City centre" || t === "Central")],
  ];
  return rows.map(([title, note, test]) => ({ title, note, count: share(homes, test) })).filter((f) => f.count > 0).sort((a, b) => b.count - a.count);
}

// How many homes say in their listing that they offer a discount for a longer stay.
export function longStayDiscounts(homes: Home[]) {
  return homes.filter((h) => parseListing(h.description, h.houseRules).longStay).length;
}
