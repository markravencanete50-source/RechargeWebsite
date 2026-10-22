import { Banknote, CalendarCheck, DoorOpen, Receipt, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import type { Faq } from "./faqs";

// The Guaranteed Rent page. The facts come from Recharge's own guaranteed rent page; the wording is written for this site.
export const benefits: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Banknote, title: "Income you can plan around", text: "You are paid on time every month, whatever the bookings do. There are no empty months for you to cover, and your cash flow stays steady." },
  { icon: DoorOpen, title: "An easy way out", text: "If we ever miss a payment, the contract lets you end the agreement the next day." },
  { icon: Receipt, title: "We pay the bills", text: "Council tax, utilities and the other running costs are ours, as in a normal tenancy. So is keeping the property compliant." },
  { icon: Wrench, title: "We look after repairs", text: "We maintain the property and its fittings. If a guest damages something, we pay to repair or replace it." },
  { icon: CalendarCheck, title: "Clear, fixed terms", text: "The rent is fixed for the length of the agreement. It can renew when both of us agree." },
  { icon: Sparkles, title: "A property kept in shape", text: "Regular cleans, a linen service and routine checks protect your property between stays." },
];

export const wePay = [
  "Your fixed rent, every month",
  "Council tax and utilities",
  "Cleaning and linen",
  "Repairs and upkeep of fittings",
  "Damage caused by guests",
  "Keeping the property compliant",
];

export const youKeep = [
  "Ownership of your property",
  "A rent you can plan around",
  "The right to end the agreement the day after a missed payment",
  "A say at renewal: it only renews if you agree",
];

export const rentSteps: [string, string][] = [
  ["Tell us about your property", "Send us the address, the size and a few details. It takes a few minutes."],
  ["Receive your proposal", "We come back with a guaranteed rent proposal for your property. It is free, with no obligation."],
  ["Agree and we get it ready", "Sign the agreement in the app. We then handle the inspection, furnishing if needed, photos and listings."],
  ["Paid every month", "From the start date you receive the same rent, on time, whatever the bookings do."],
];

// Landlords' own words, as given on Recharge's guaranteed rent page. Not edited.
export const landlords: { quote: string; name: string; place: string }[] = [
  { quote: "Guaranteed Rent has removed a lot of the stress of being a landlord. Alex handles everything, and my income is paid on time every month without fail. No voids, no chasing tenants, no hassle - just consistent, reliable income. It’s been a game-changer for me.", name: "Riccardo", place: "Edinburgh" },
  { quote: "Managing my STL myself became a full-time job I never meant to have. I was exhausted trying to keep up with cleans, admin and guests. Switching to guaranteed rent has been a lot easier, and more predictable.", name: "Mrs L", place: "Livingston" },
  { quote: "We’re overseas, so reliability matters. The guaranteed rent covers vacant periods, maintenance is managed to the agreed limit, and compliance is kept up to date. Peace of mind, full stop.", name: "Ben", place: "Edinburgh" },
];

export function guaranteedFaqs(regions: string[]): Faq[] {
  return [
    { q: "What is guaranteed rent?", a: "Guaranteed rent is an arrangement where we pay you a fixed rent every month, whether your property is occupied or not. We take full responsibility for running and looking after the property." },
    { q: "Do I still get paid when the property is empty?", a: "Yes. The rent is fixed. You receive the same amount every month, whether the property is booked or not." },
    { q: "How is it different from a normal tenancy?", a: "In one way it is the same: we pay the rent and the running costs. The difference is that we run your property as serviced accommodation, with guests who stay for short periods, so you have no tenants to deal with." },
    { q: "Who pays the bills, such as council tax and utilities?", a: "We do. Running costs such as council tax and utilities are at our expense, as in a normal tenancy." },
    { q: "Who pays for repairs and damage?", a: "We look after maintenance and the upkeep of the property's fittings. If a guest damages a fixture, we cover the cost of repair or replacement." },
    { q: "What happens if you miss a payment?", a: "The contract lets you end the agreement the next day." },
    { q: "How long is the agreement?", a: "The rent is fixed for the term of the agreement, and the length is agreed with you before you sign. At the end it can renew if both of us agree." },
    { q: "Is the proposal free?", a: "Yes. The proposal is free and there is no obligation to go ahead." },
    { q: "Which areas do you cover?", a: `We run homes in ${regions.length} areas of Scotland today, including ${regions.slice(0, 5).join(", ")}. If your property is somewhere else in Scotland, send us the details and we will tell you if we can help.` },
    { q: "Can I choose full management instead?", a: "Yes. With full management we run the property as a short let and you keep the earnings after our fee. You can compare the two on our Owners page." },
  ];
}
