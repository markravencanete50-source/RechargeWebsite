import { BadgePercent, BadgeCheck, Camera, Car, ClipboardCheck, HandCoins, Headset, House, LayoutDashboard, MapPinned, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { parseListing } from "./listing";
import { homes, regions, reviewTotal } from "./properties";
import { DIRECT, site } from "./site";

// Why people choose Recharge, from facts the site can stand behind: the listings and the app.
export type Reason = { icon: LucideIcon; title: string; text: string };

const count = (test: (h: (typeof homes)[number]) => boolean) => homes.filter(test).length;
const parking = count((h) => h.amenities.some((a) => /parking/i.test(a)));
const kitchens = count((h) => h.amenities.some((a) => /kitchen/i.test(a)));
const longStay = count((h) => parseListing(h.description, h.houseRules).longStay);

export const ownerReasons: Reason[] = [
  { icon: LayoutDashboard, title: "You see everything", text: "Your own client portal shows bookings, performance, statements and repairs as they happen." },
  { icon: HandCoins, title: "Paid from cleared funds", text: "Income is matched to platform payouts and bank receipts before your statement is issued." },
  { icon: ClipboardCheck, title: "You set the repair limit", text: "Choose how much a repair can cost before we ask you. Anything over it, and all furnishing, is quoted first and waits for your yes in the app." },
  { icon: Users, title: "One team, end to end", text: "Our own guest support, cleaning, maintenance and accounts teams work from the same app." },
  { icon: BadgeCheck, title: "Licensing kept in order", text: "Short-term let applications, renewals and deadlines are tracked for every property." },
  { icon: ShieldCheck, title: "A proven operation", text: `We run ${homes.length} homes across ${regions.length} areas of Scotland, with ${reviewTotal.toLocaleString("en-GB")} guest reviews so far.` },
];

export const guestReasons: Reason[] = [
  { icon: BadgePercent, title: `Save ${DIRECT} booking direct`, text: "The same home costs less when you book with us rather than through a platform." },
  { icon: House, title: "A whole home, not a room", text: `${kitchens} of our ${homes.length} homes have a kitchen, so you can live normally, not out of a suitcase.` },
  { icon: Camera, title: "Checked before you arrive", text: "Every clean is finished with photo evidence in the Recharge app." },
  { icon: Headset, title: "A real person, 24/7", text: `Call ${site.phone.display} at any hour. Urgent problems go straight to maintenance.` },
  { icon: Car, title: "Parking at most homes", text: `${parking} of our homes list parking, which suits contractors and road trips.` },
  { icon: MapPinned, title: "Long stays welcome", text: `${longStay} homes offer long-stay discounts on request, across ${regions.length} areas of Scotland.` },
];
