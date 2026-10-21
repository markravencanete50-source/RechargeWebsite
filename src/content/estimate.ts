// The nightly rates for the owner's earnings calculator, built on the server from the homes we run (see estimate-sums.ts).
import { BEDROOMS, type RateTable } from "./estimate-sums";
import { homes, regions } from "./properties";

const quantile = (sorted: number[], q: number) => {
  const i = (sorted.length - 1) * q, lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
};
const median = (xs: number[]) => quantile([...xs].sort((a, b) => a - b), 0.5);
const bedKey = (n: number) => Math.min(Math.max(n, 1), 5);
const words = ["", "one", "two", "three", "four", "five or more"];
const bedWords = (n: number) => `${words[n]}-bedroom`;

// Built once on the server from the homes we run, and handed to the calculator as plain numbers.
export function rateTable(): RateTable {
  const priced = homes.filter((h) => typeof h.price === "number" && h.price > 0) as (typeof homes[number] & { price: number })[];
  const national: Record<number, number[]> = {};
  for (const h of priced) (national[bedKey(h.bedrooms)] ??= []).push(h.price);
  const nationalMedian = Object.fromEntries(Object.entries(national).map(([b, ps]) => [b, median(ps)]));
  const areas = regions.map((r) => r.name);
  const rates: RateTable["rates"] = {};
  for (const area of areas) {
    const local = priced.filter((h) => h.region === area);
    // How the area's prices compare with the same size of home across Scotland, kept within reason.
    const ratios = local.filter((h) => nationalMedian[bedKey(h.bedrooms)]).map((h) => h.price / nationalMedian[bedKey(h.bedrooms)]);
    const index = ratios.length >= 2 ? Math.min(1.4, Math.max(0.7, median(ratios))) : 1;
    rates[area] = {};
    for (const beds of BEDROOMS) {
      const same = local.filter((h) => bedKey(h.bedrooms) === beds).map((h) => h.price).sort((a, b) => a - b);
      const pool = same.length >= 3 ? same : (national[beds] ?? []).map((p) => p * index).sort((a, b) => a - b);
      if (!pool.length) continue;
      const round = (n: number) => Math.round(n);
      rates[area][beds] = {
        low: round(quantile(pool, 0.25)), medium: round(quantile(pool, 0.5)), high: round(quantile(pool, 0.75)),
        basis: same.length >= 3
          ? `From the ${same.length} ${bedWords(beds)} homes we run in ${area}.`
          : `From the ${pool.length} ${bedWords(beds)} homes we run across Scotland, adjusted for prices in ${area}.`,
      };
    }
  }
  return { areas: areas.filter((a) => Object.keys(rates[a]).length), rates };
}
