import { site } from "./site";

export type Faq = { q: string; a: string };

export const guestFaqs: Faq[] = [
  { q: "How do I book a stay?", a: `Search our homes on the Properties page and book direct. Booking direct gets you ${site.directDiscount} off your stay. You can also find our homes on the major booking platforms.` },
  { q: "When do I get my check-in details?", a: "Before you arrive. We send the address, access instructions and wifi details ahead of your stay." },
  { q: "What if something is wrong during my stay?", a: "Contact us at any hour. Support runs 24/7, and urgent problems are passed straight to our maintenance team." },
  { q: "Are your homes suitable for work trips?", a: "Yes. Our homes suit contractors, business travel and longer stays as well as city breaks and families." },
];

export const ownerFaqs: Faq[] = [
  { q: "What is guaranteed rent?", a: "We rent your property for a fixed monthly amount and run it as serviced accommodation. You receive the same rent every month, whether the property is booked or not." },
  { q: "What does full management include?", a: "Listings, daily pricing, guest messages, check-in, cleaning, laundry, repairs and monthly statements. You can see all of it in the Recharge app." },
  { q: "Do I need a short-term let licence?", a: "In Scotland, short lets need a licence from the local council. We help you through the application and keep your licence details in order." },
  { q: "How do I see what is happening at my property?", a: "Through the Recharge app. You see bookings, cleans, repairs, statements and payouts, and you approve costs from your phone." },
  { q: "How do I get started?", a: "Send us a few details about your property. We come back with an estimate, then book an inspection if you want to go ahead." },
];
