// The sums of the owner's earnings calculator on the Owners page. The sums are the Recharge app's owner estimate explorer
// (lib/estimate-projection.ts in the app): a year of 365 nights at the chosen occupancy and nightly rate is the booking income;
// platform fees are charged only on the share not booked direct; the management fee is charged on the booking income; the
// rest is the owner's. The nightly rates come from the homes we run: the quieter, typical and strong prices (the lower
// quartile, median and upper quartile) of our homes with the same bedrooms in the same area when there are at least three,
// otherwise of our homes with the same bedrooms across Scotland, adjusted by how the area's prices compare.
// Kept apart from the rate table so the calculator in the browser carries no property data.

export type Scenario = "low" | "medium" | "high";
export const SCENARIOS: { id: Scenario; label: string; note: string }[] = [
  { id: "low", label: "Quieter", note: "A cautious year" },
  { id: "medium", label: "Expected", note: "A typical year" },
  { id: "high", label: "Strong", note: "A busy year" },
];
export const AVAILABLE_NIGHTS = 365;
export const OCCUPANCY = { min: 30, max: 95, step: 5, start: 75 };
export const DIRECT = { min: 0, max: 50, step: 5, start: 10 };
export const PLATFORM_FEE = 15;
export const MANAGEMENT_FEES = [12, 15] as const;
export const BEDROOMS = [1, 2, 3, 4, 5] as const;

export type Rates = { low: number; medium: number; high: number; basis: string };
export type RateTable = { areas: string[]; rates: Record<string, Record<number, Rates>> };

export type Projection = { rate: number; nights: number; gross: number; platform: number; management: number; owner: number; monthly: number };
// The app's projection, in pounds: management fee on the booking income, platform fees on the share not booked direct.
export function project(rate: number, occupancy: number, direct: number, managementFee: number): Projection {
  const gross = Math.round(rate * AVAILABLE_NIGHTS * occupancy / 100);
  const platform = Math.round(gross * (100 - direct) / 100 * PLATFORM_FEE / 100);
  const management = Math.round(gross * managementFee / 100);
  const owner = gross - platform - management;
  return { rate, nights: Math.round(AVAILABLE_NIGHTS * occupancy / 100), gross, platform, management, owner, monthly: Math.round(owner / 12) };
}
