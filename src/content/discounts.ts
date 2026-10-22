// Which discounts apply to a stay. Used by the booking card in the browser and again on the server when a request is sent, so
// the guest and the team see the same thing. Offers have optional dates and an optional area; when several fit, only the biggest
// counts. The new-guest discount is added to it. Discounts come off the nightly price, not the cleaning fee, and never more than half.
import type { Discount } from "./catalog";

export type StayDiscounts = { offer: Pick<Discount, "label" | "percent"> | null; newGuest: Pick<Discount, "label" | "percent"> | null };

// Today's date in Scotland, as YYYY-MM-DD.
export const ukToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());

export function discountsFor(all: Discount[], region: string, today = ukToday()): StayDiscounts {
  const live = all.filter((d) => d.active && (!d.starts_on || d.starts_on <= today) && (!d.ends_on || d.ends_on >= today));
  const offer = live.filter((d) => d.kind === "offer" && (!d.region || d.region === region)).sort((a, b) => b.percent - a.percent)[0] ?? null;
  const newGuest = live.find((d) => d.kind === "new_customer") ?? null;
  return { offer: offer && { label: offer.label, percent: offer.percent }, newGuest: newGuest && { label: newGuest.label, percent: newGuest.percent } };
}

// The amount off a nightly subtotal for the given percentages.
export const amountOff = (subtotal: number, ...percents: number[]) => Math.round(subtotal * Math.min(50, percents.reduce((a, b) => a + b, 0))) / 100;
