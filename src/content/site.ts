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
  // CONFIRM: the old home page offers 10% off for booking direct.
  directDiscount: "10%",
  areas: ["Glasgow", "Edinburgh", "Paisley", "Livingston"],
} as const;

export const nav = [
  { href: "/#stay", label: "Stay" },
  { href: "/#owners", label: "Owners" },
  { href: "/#app", label: "The app" },
  { href: "/#support", label: "Support" },
  { href: "/#faq", label: "FAQ" },
] as const;
