// Shared wording for the About pages.
import { packShot } from "./showcase";

export const principles = [
  {
    title: "Reliability", text: "Owners are paid on time and guests are looked after at any hour. We build the business so that it holds up on a bad day, not only a good one.",
    proof: ["Support answered 24 hours a day, every day of the year", "Owners paid from cleared funds, so the figures are real money", "Every clean finished with photo evidence before the next guest"],
  },
  {
    title: "Transparency", text: "Owners see every booking, cost and payout in their own portal. We ask before we spend, and we show our working.",
    proof: ["Each stay matched to the platform payout and the bank before it reaches a statement", "Repairs over the owner's limit, and all furnishing, wait for the owner to approve the quote", "The earnings calculator uses the same sums as our own estimates"],
  },
  {
    title: "Results", text: "Prices are set from the market, not from habit. We review them every day and learn from every stay.",
    proof: ["Prices reviewed every day", "Homes listed on the major booking platforms and on our own website", "Guest messages tracked with live response timers"],
  },
];

export const guestGroups = [
  { id: "business", trip: "business", shot: packShot("S06"), tall: true, label: "For work", title: "Business trips and contracts", text: "Well-equipped homes for people working away, with wifi and a kitchen that works." },
  { id: "families", trip: "families", shot: packShot("S04"), tall: false, label: "For leisure", title: "Holidays and weekends", text: "Space for families and groups, close to what they came to see, with everything ready on arrival." },
  { id: "long-stays", trip: "long-stays", shot: packShot("S05"), tall: true, label: "For life situations", title: "Moves, repairs and in-between", text: "A comfortable home for weeks or months while someone relocates, renovates or waits for the keys." },
];
