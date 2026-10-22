// Business facts used across the site. Anything marked CONFIRM came from the old site at
// rechargestays.co.uk (via search results) and needs checking with Recharge before launch.

export const site = {
  name: "Recharge",
  domain: "rechargestays.co.uk",
  url: "https://rechargestays.co.uk",
  email: "enquiries@rechargestays.co.uk",
  // CONFIRM: the old site shows three different numbers. This is the one on its Contact page.
  phone: { display: "0141 375 9450", href: "tel:+441413759450" },
  // CONFIRM: direct bookings currently go to the Zeevou booking site.
  bookingUrl: "https://rechargestays1.zeevou.direct/",
  // CONFIRM: the old About page says "over 100 properties".
  homesManaged: "100+",
  // CONFIRM: registered company name, number and office for the footer (UK trading disclosure rules).
  company: { legalName: "", number: "", registeredOffice: "" },
  // Owners sign in to their client portal in the Recharge app.
  ownerLogin: "https://app.rechargegroup.co.uk/sign-in",
  // The owner enquiry form lives in the Recharge app. Set NEXT_PUBLIC_ENQUIRY_API (for example
  // https://app.rechargegroup.co.uk) once the app accepts submissions from this website's origin,
  // and the form on the Owners page sends there directly instead of linking out.
  enquiry: { formUrl: "https://app.rechargegroup.co.uk/enquiry", api: process.env.NEXT_PUBLIC_ENQUIRY_API ?? "" },
} as const;

export const nav = [
  { href: "/properties", label: "Properties" },
  { href: "/stay", label: "Stays" },
  { href: "/owners", label: "Owners" },
  { href: "/app", label: "The app" },
  { href: "/support", label: "Support" },
  { href: "/faq", label: "FAQ" },
] as const;

// The direct-booking saving is set in the dashboard (Discounts). Shared texts carry this mark where the figure goes, and each page
// fills it in with withDirect from the live catalog, so changing the figure changes every page within a minute.
export const DIRECT = "{direct}";
export const withDirect = <T extends Record<string, unknown>>(items: T[], direct: string): T[] =>
  items.map((it) => Object.fromEntries(Object.entries(it).map(([k, v]) => [k, typeof v === "string" ? v.replaceAll(DIRECT, direct) : v])) as T);
