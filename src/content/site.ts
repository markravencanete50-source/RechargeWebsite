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

export type NavLink = { href: string; label: string; text?: string };
export type NavItem = NavLink & { children?: NavLink[] };

// The main menu. Owners and Support open to the pages below them, so every key page is one step from any page.
export const nav: NavItem[] = [
  { href: "/properties", label: "Properties" },
  {
    href: "/stay", label: "Stays",
    children: [
      { href: "/stay", label: "Staying with us", text: "Whole homes across Scotland" },
      { href: "/stay/book-direct", label: "Book direct and save", text: "A better rate than the booking sites" },
      { href: "/stay/trips", label: "Trips we suit", text: "Families, contractors, work and long stays" },
      { href: "/stay/check-in", label: "Check-in and house rules", text: "Times, ID checks and the rules" },
      { href: "/stay/amenities", label: "What our homes have", text: "Kitchen, wifi, linen and more" },
      { href: "/faq#guests", label: "Guest questions", text: "Answers before you book" },
    ],
  },
  {
    href: "/owners", label: "Owners",
    children: [
      { href: "/owners", label: "For owners", text: "Two ways to work with us" },
      { href: "/guaranteed-rent", label: "Guaranteed rent", text: "A fixed rent, paid every month" },
      { href: "/owners/full-management", label: "Full management", text: "We run it, you keep the earnings" },
      { href: "/owners/earnings-calculator", label: "Earnings calculator", text: "What could your property earn?" },
      { href: "/owners/example-statement", label: "Example statement", text: "See where every pound goes" },
      { href: "/owners/furnishing-calculator", label: "Furnishing calculator", text: "Everything a home needs, room by room" },
    ],
  },
  {
    href: "/app", label: "The app",
    children: [
      { href: "/app", label: "The Recharge app", text: "One app runs every home" },
      { href: "/app/how-it-works", label: "How it works", text: "One booking, start to finish" },
      { href: "/app/owner-portal", label: "Owner portal", text: "Bookings, statements and approvals" },
      { href: "/app/bookings-and-guests", label: "Bookings and guests", text: "Pricing, listings and the guest inbox" },
      { href: "/app/cleaning", label: "Cleaning", text: "Every turnover planned and checked" },
      { href: "/app/maintenance", label: "Maintenance and setup", text: "Repairs, inspections and furnishing" },
      { href: "/app/accounts", label: "Accounts", text: "Payouts matched before anyone is paid" },
    ],
  },
  {
    href: "/support", label: "Support",
    children: [
      { href: "/support", label: "24/7 support", text: "A real person, day and night" },
      { href: "/support/report-a-problem", label: "Report a problem", text: "For guests and neighbours" },
      { href: "/faq", label: "Questions and answers", text: "Guests, owners and the app" },
    ],
  },
  {
    href: "/about", label: "About",
    children: [
      { href: "/about", label: "About Recharge", text: "Who we are and how we started" },
      { href: "/about/how-we-work", label: "How we work", text: "Reliability, transparency, results" },
      { href: "/about/who-stays", label: "Who stays with us", text: "Work, leisure and life in between" },
      { href: "/about/where-we-work", label: "Where we work", text: "Every area and town we cover" },
      { href: "/about/partners", label: "Trusted partners", text: "Where our homes can be booked" },
      { href: "/about/contact", label: "Contact us", text: "Phone, email and a message form" },
    ],
  },
];

// The direct-booking saving is set in the dashboard (Discounts). Shared texts carry this mark where the figure goes, and each page
// fills it in with withDirect from the live catalog, so changing the figure changes every page within a minute.
export const DIRECT = "{direct}";
export const withDirect = <T extends Record<string, unknown>>(items: T[], direct: string): T[] =>
  items.map((it) => Object.fromEntries(Object.entries(it).map(([k, v]) => [k, typeof v === "string" ? v.replaceAll(DIRECT, direct) : v])) as T);
