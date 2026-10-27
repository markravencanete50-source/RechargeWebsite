// Owner onboarding, from Recharge's business plan (v1.0, October 2026: Property Onboarding) and the owner's checklist in the
// Recharge app (lib/client-onboarding.ts and lib/onboarding-content.ts), so the website describes the same steps the owner then
// sees in the app. Prices are Recharge's own, from the business plan; change them here and every page follows.
import type { Faq } from "./faqs";

export type Stage = { title: string; text: string };

// The eight stages of the business plan's onboarding framework, in the owner's words.
export const stages: Stage[] = [
  { title: "Tell us about your property", text: "Fill in the free estimate form. A member of the team will be in touch with your estimate by email, usually within 48 hours. Create an account in the Recharge app to follow it as it happens." },
  { title: "We prepare your estimate", text: "We look at how our own homes within 30 miles perform, compare similar short lets nearby, and check events and contractor work in the area over the next 12 months. Then we set a low, medium and high nightly rate." },
  { title: "You review it in the app", text: "Our directors, Alex and Rachel, explain who we are, how we work and what it costs. Your estimate shows the low, medium and high rate, with occupancy you can change. Then choose to go ahead, keep reviewing, or not go ahead." },
  { title: "Build your onboarding package", text: "For each part of getting ready, choose whether you do it yourself or we do it. Where we charge, you see the price before you choose, and anything we quote waits for your approval." },
  { title: "Sign the agreement", text: "Your details fill in the agreement, and you sign it in the app. A copy is kept with your property's documents in the app." },
  { title: "Pay the onboarding fee", text: "A one-off invoice to set the property up, sent once the agreement is signed. Nothing is charged before then. Once it is paid, the work you asked us to do begins." },
  { title: "We get it ready for guests", text: "Inspection, furnishing, broadband, safety certificates, licensing, a final readiness inspection, photography, housekeeping, pricing and listings. Each step shows in the app as it is done." },
  { title: "Live", text: "Your listings go live and the first guests can book." },
];

// What the onboarding package asks, and what each choice costs if Recharge does it.
export type PackageItem = { title: string; text: string; price?: string };
export const packageItems: PackageItem[] = [
  { title: "Property set-up", text: "Your property needs the right furniture and equipment, in a condition fit for guests. If we do it, we inspect the property, list what it needs for its size, and quote a standard or enhanced furnishing package you can change item by item.", price: "Quoted for your property" },
  { title: "Broadband", text: "We do not sign owners up to broadband, because of how broadband contracts work. We give you a guide to choosing a package. Once you have signed up, we can install it for you.", price: "Installation £50 + VAT" },
  { title: "Gas and electricity", text: "We do not sign owners up to energy contracts either. Set them up yourself, and move a prepayment meter to a credit meter. We recommend Octopus Energy, because one log-in covers all your properties." },
  { title: "Safety certificates", text: "EICR, gas safety, PAT testing, EPC, a Legionella risk assessment, and interlinked smoke, heat and carbon monoxide alarms. Upload the ones you have, or we arrange the rest, with the work itself quoted for your approval first. We send a reminder three months before each one expires.", price: "£10 + VAT each to arrange" },
  { title: "Short-term let licence", text: "We work with License to Let, a specialist short-term let licensing company. We have no financial link with them. If you like, they contact you about your licence.", price: "Their fee: £399 full, £299 temporary" },
  { title: "Garden", text: "If the property has a garden, we can get you a quote for regular garden maintenance. Otherwise you look after it." },
  { title: "Bins", text: "If the bins are communal, our housekeepers use them. Waste from a short-term let counts as commercial waste, so the council does not collect private bins. Our partner empties them every week, or you arrange your own.", price: "£95 a month" },
  { title: "Payouts and repairs", text: "The owner or operator's name, the bank account for your payouts, the limit under which repairs go ahead without asking you, and who to call first for repairs. These fill in your agreement." },
];

// Every onboarding includes these (the business plan's package summary).
export const included = ["A pricing strategy for the property", "Your listings written and prepared", "Professional photography", "A property inspection"];

// The condition check before a property goes live: the business plan's 15 points.
export const conditionChecks = [
  "Walls, ceilings and paintwork",
  "Floors and carpets",
  "Doors, windows and locks",
  "Furniture",
  "Beds and mattresses",
  "Linen and soft furnishings",
  "Kitchen surfaces and fittings",
  "Appliances",
  "Bathrooms and plumbing",
  "Heating, hot water and ventilation",
  "Lighting and visible electrics",
  "Wifi, TV and guest controls",
  "Safety and access",
  "Outside and the way in",
  "Final presentation",
];

export const onboardingFaqs: Faq[] = [
  { q: "How long does the estimate take?", a: "A member of the team will be in touch with your estimate by email, usually within 48 hours of your form." },
  { q: "Is the estimate free?", a: "Yes. There is no charge and no obligation to go ahead." },
  { q: "What if I need more time to decide?", a: "Choose Still reviewing and pick a date. We check in with you then, and nothing moves on until you decide." },
  { q: "Do I have to use Recharge for everything?", a: "No. For each part of the onboarding package you choose whether you do it or we do it. You only pay for what you ask us to do." },
  { q: "When do I pay the onboarding fee?", a: "Once the agreement is signed. Nothing is charged before then." },
  { q: "How do I follow my onboarding?", a: "In the Recharge app. Every step shows there as it is done, and each property has its own chat with the team. You also get updates by email." },
  { q: "I already work with Recharge. How do I add another property?", a: "Sign in to the Recharge app and choose New property. You fill in the same details, and the estimate comes to your account." },
];
