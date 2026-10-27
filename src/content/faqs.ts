import { homes, regions } from "./properties";
import { DIRECT, site } from "./site";
import { toolCount } from "./tools";

export type Faq = { q: string; a: string };

export const generalFaqs: Faq[] = [
  { q: "What is Recharge?", a: `Recharge is a Scottish serviced accommodation and short-let management company. We run ${homes.length} homes across ${regions.length} areas of Scotland, from Glasgow and Edinburgh to the Borders and Skye, through our own app with 24/7 support.` },
  { q: "Can I book a Recharge home direct?", a: `Yes. Search our homes on the Properties page and book direct. Booking direct saves ${DIRECT} compared with booking the same home elsewhere.` },
  { q: "Do you manage properties for owners?", a: "Yes. Owners choose guaranteed rent, where we pay a fixed monthly rent, or full management, where we run the property and you keep the income after our fee. Both are run through the Recharge app." },
  { q: "What makes Recharge different from other short-let managers?", a: `We built our own app with ${toolCount} tools. Owners, guest support, cleaners, maintenance and accounts all work from it, so every booking, clean, repair and payout has a record you can see.` },
  { q: "Is support really 24/7?", a: `Yes. Guests and owners can reach a real person at any hour on ${site.phone.display}. Urgent problems go straight to our maintenance team.` },
];

export const guestFaqs: Faq[] = [
  { q: "How do I book a stay?", a: `Search our homes on the Properties page and book direct. Booking direct gets you ${DIRECT} off your stay. You can also find our homes on the major booking platforms.` },
  { q: "When do I get my check-in details?", a: "Before you arrive. We send the address, access instructions and wifi details ahead of your stay." },
  { q: "What if something is wrong during my stay?", a: "Contact us at any hour. Support runs 24/7, and urgent problems are passed straight to our maintenance team." },
  { q: "Are your homes suitable for work trips?", a: "Yes. Our homes suit contractors, business travel and longer stays as well as city breaks and families." },
  { q: "Do you offer long-stay discounts?", a: `Many of our homes offer long-stay discounts on request. Call ${site.phone.display} or email ${site.email} with your dates and the home you like.` },
  { q: "What is included in every stay?", a: "A professionally cleaned home, fresh bed linen and towels, a kitchen with cooking basics and 24/7 support. Each home lists exactly what it has." },
  { q: "Is there parking?", a: "Many homes have free parking. Each property page shows its parking under What this home offers." },
  { q: "What time are check-in and check-out?", a: "Most homes check in from 15:00 and check out by 10:00. A few use 16:00 and 11:00. Each property page shows its own times." },
  { q: "Are your homes suitable for children?", a: `${homes.filter((h) => h.amenities.some((a) => /child|famil/i.test(a))).length} of our ${homes.length} homes are listed as suitable for children. Each property page shows the beds in every room, so you can check the layout before you book.` },
  { q: "Do I need to register or show ID?", a: "Some homes ask every guest to complete a short registration and ID check through a secure link before check-in. The house rules on the property page say if this applies." },
  { q: "Can I have a party or smoke in the home?", a: "No. Our house rules do not allow parties or loud music, and smoking and vaping are not allowed inside or outside the property." },
  { q: "Can I extend my stay?", a: `Call ${site.phone.display} or message us. We check whether the home is free for the extra nights and how a longer stay is priced.` },
];

export const ownerFaqs: Faq[] = [
  { q: "What is guaranteed rent?", a: "We rent your property for a fixed monthly amount and run it as serviced accommodation. You receive the same rent every month, whether the property is booked or not." },
  { q: "What does full management include?", a: "Listings, daily pricing, guest messages, check-in, cleaning, laundry, repairs and monthly statements. You can see all of it in the Recharge app." },
  { q: "Do I need a short-term let licence?", a: "In Scotland, short lets need a licence from the local council. We help you through the application and track your licence, renewals and deadlines in the app." },
  { q: "How do I see what is happening at my property?", a: "Through the Recharge client portal. You see bookings, performance, cleans, repairs, statements and payouts, and you approve costs from your phone." },
  { q: "How are owner statements worked out?", a: "Booking income is matched to the platform payouts and the money received in the bank. Statements are issued from cleared funds, so the figures are real money." },
  { q: "Can you furnish my property?", a: "Yes. Our Recharge Ready team quotes the furnishing item by item. You accept or reject the quote in the app. If you prefer to furnish it yourself, our calculator gives you a room-by-room checklist." },
  { q: "How do I get started?", a: "Fill in the free performance estimate form. A member of the team will be in touch with your estimate by email, usually within 48 hours. You review it in the Recharge app, choose what you would like us to do, and sign the agreement there." },
  { q: "Is the performance estimate free?", a: "Yes. There is no charge and no obligation to go ahead." },
  { q: "Which areas do you cover?", a: `We run homes in ${regions.length} areas of Scotland today, including ${regions.slice(0, 5).map((r) => r.name).join(", ")}. If your property is somewhere else in Scotland, send us the details and we will tell you if we can help.` },
  { q: "Will I know when guests are staying?", a: "Yes. Every booking appears in the calendar in your client portal, along with how each property is performing." },
];

export const appFaqs: Faq[] = [
  { q: "Who uses the Recharge app?", a: "Owners, our guest support team, cleaners, the maintenance team and our accounts team. Each person sees only the homes and jobs they look after." },
  { q: "What can owners do in the app?", a: "See bookings and performance, read statements, approve repair and furnishing quotes, follow onboarding, and see photographed post that arrives at the property." },
  { q: "How does the app keep cleaning standards high?", a: "Every clean is created from a booking, assigned to a cleaner and finished with photo evidence. Quality is tracked by cleaner and by property." },
  { q: "How are repairs handled?", a: "A problem raised by a guest, cleaner or owner becomes a job. Maintenance quotes it, the owner approves it in the app, and the work is tracked to completion with photos." },
  { q: `How many tools are in the app?`, a: `${toolCount} tools across five teams: owners, bookings and guests, cleaning, maintenance and accounts.` },
  { q: "Do owners see all of those tools?", a: "No. The tools are for our own teams. Owners see their client portal: bookings, performance, statements, approvals, onboarding and post." },
  { q: "How do guest messages get answered quickly?", a: "Every guest message lands in one inbox with a live response timer, so no message waits unnoticed. Anything urgent is escalated." },
];

export const supportFaqs: Faq[] = [
  { q: "How do I contact Recharge at night?", a: `Call ${site.phone.display}. Support runs 24 hours a day, 7 days a week, including weekends.` },
  { q: "I am locked out. What do I do?", a: `Call ${site.phone.display} straight away. We talk you through access and arrange help if it is needed.` },
  { q: "Something in the home is broken. Who fixes it?", a: "Tell us and it becomes a repair job in the app. Urgent problems go straight to our maintenance team." },
  { q: "I am an owner. Who do I speak to?", a: `Message us in the app, call ${site.phone.display} or email ${site.email}. Your bookings, statements and repairs are also in the client portal.` },
];

export const supportExtraFaqs: Faq[] = [
  { q: "How quickly will someone reply?", a: "Messages are tracked with live response timers, so none waits unnoticed. For anything urgent, call us rather than messaging." },
  { q: "I have left something behind. What should I do?", a: `Contact us with what it is and where you left it. Call ${site.phone.display} or email ${site.email}.` },
  { q: "I live next door to a Recharge home. Who do I contact?", a: `Call ${site.phone.display} at any hour. Your concern is logged and passed to the team responsible for that home.` },
];

export const propertiesFaqs: Faq[] = [
  { q: "Where are Recharge homes?", a: `${homes.length} homes across ${regions.length} areas of Scotland. The most are in ${regions.slice(0, 4).map((r) => r.name).join(", ")}.` },
  { q: "How do I filter by bedrooms or price?", a: "Use Filters in the search bar to set bedrooms, bathrooms, a minimum price and a maximum price. Your choices stay in the web address, so you can share a search." },
  { q: "Are the prices shown final?", a: "No. Each home shows a typical nightly rate. Rates change by date, and your exact total shows when you choose dates." },
  { q: "Can I book for a large group?", a: "Yes. Several homes sleep eight or more. Set the number of guests in the search to see the homes that fit." },
];

// Questions answered from one home's own listing, so each property page carries its own FAQ.
export function homeFaqs(
  home: { guests?: number; bedrooms: number; beds?: number; bathrooms?: number; checkIn?: string; checkOut?: string; amenities: string[]; town: string; region: string },
  extra: { longStay: boolean; places: { name: string; time?: string }[] },
): Faq[] {
  const has = (re: RegExp) => home.amenities.find((a) => re.test(a));
  const out: Faq[] = [];
  if (home.guests) out.push({ q: "How many guests can stay here?", a: `Up to ${home.guests} guests, across ${home.bedrooms === 0 ? "a studio" : `${home.bedrooms} bedroom${home.bedrooms === 1 ? "" : "s"}`}${home.beds ? ` with ${home.beds} bed${home.beds === 1 ? "" : "s"}` : ""}${home.bathrooms ? ` and ${home.bathrooms} bathroom${home.bathrooms === 1 ? "" : "s"}` : ""}.` });
  if (home.checkIn || home.checkOut) out.push({ q: "What time are check-in and check-out?", a: [home.checkIn && `Check-in is from ${home.checkIn}.`, home.checkOut && `Check-out is by ${home.checkOut}.`, "We send your arrival details before your stay."].filter(Boolean).join(" ") });
  const parking = has(/parking/i);
  if (parking) out.push({ q: "Is there parking?", a: `Yes. This home lists ${parking.toLowerCase()}.` });
  if (has(/wi-?fi|internet/i)) out.push({ q: "Is there wifi?", a: "Yes. Wifi is included, and the details come with your check-in information." });
  if (extra.longStay) out.push({ q: "Can I book a long stay?", a: `Yes. Long-stay discounts are available on request. Call ${site.phone.display} or email ${site.email} with your dates.` });
  if (extra.places.length) out.push({ q: `What is near this home in ${home.town}?`, a: extra.places.slice(0, 4).map((p) => (p.time ? `${p.name} (${p.time})` : p.name)).join(", ") + "." });
  out.push({ q: "How do I book this home direct?", a: `Choose Check dates and book. Booking direct with Recharge saves ${DIRECT}, and our team is on hand 24/7 during your stay.` });
  return out;
}
