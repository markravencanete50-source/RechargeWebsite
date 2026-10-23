// The pages of the app section, one per team. The tools themselves are in tools.ts; this adds what each page says around them.
import type { Faq } from "./faqs";
import { appFaqs, ownerFaqs, supportExtraFaqs } from "./faqs";
import { journey, teams } from "./tools";

export type AppPage = {
  slug: string; team: string; title: string; lead: string; screen?: string; screenAlt?: string; photo?: "S01" | "S02";
  who: string[]; steps: string[]; faqs: Faq[]; links: { href: string; label: string; text: string }[];
};

const faq = (list: Faq[], q: string) => list.find((f) => f.q === q)!;

export const appPages: AppPage[] = [
  {
    slug: "owner-portal", team: "owners", title: "The owner portal",
    lead: "What owners see: their property, bookings, money and repairs in one secure place, on their phone.",
    screen: "/app/owner.webp", screenAlt: "Recharge app: owner home with properties, approvals, messages and earnings",
    who: ["Owners on guaranteed rent or full management", "One login per owner, showing only their own properties"],
    steps: ["A guest books", "Repair approved", "The owner is paid"],
    faqs: [faq(appFaqs, "What can owners do in the app?"), faq(appFaqs, "Do owners see all of those tools?"), faq(ownerFaqs, "How are owner statements worked out?"), faq(ownerFaqs, "Will I know when guests are staying?")],
    links: [{ href: "/owners/example-statement", label: "Example statement", text: "See where every pound goes." }, { href: "/owners/furnishing-calculator", label: "Furnishing calculator", text: "The self-furnishing checklist from the portal." }],
  },
  {
    slug: "bookings-and-guests", team: "stays", title: "Bookings and guests",
    lead: "How every listing is priced, checked and looked after, and how every guest message is answered.",
    screen: "/app/stays.webp", screenAlt: "Recharge app: the stays team home with the guest inbox",
    who: ["Our guest support team, day and night", "The team that prices and checks every listing"],
    steps: ["A guest books", "Questions answered"],
    faqs: [faq(appFaqs, "How do guest messages get answered quickly?"), faq(supportExtraFaqs, "How quickly will someone reply?")],
    links: [{ href: "/support", label: "24/7 support", text: "How the team behind the inbox helps." }, { href: "/stay/book-direct", label: "Book direct", text: "Why direct bookings cost guests less." }],
  },
  {
    slug: "cleaning", team: "cleans", title: "Cleaning", photo: "S01",
    lead: "How every turnover is planned, checked and paid, so each guest arrives to a home that is ready.",
    screen: "/app/cleaner.webp", screenAlt: "Recharge app: a cleaner's home with the clean calendar",
    who: ["Our cleaners, who see only the cleans assigned to them", "The team that checks quality by cleaner and by property"],
    steps: ["Checkout triggers a clean", "A problem is reported"],
    faqs: [faq(appFaqs, "How does the app keep cleaning standards high?")],
    links: [{ href: "/stay/amenities", label: "What our homes have", text: "What every clean leaves ready." }],
  },
  {
    slug: "maintenance", team: "ready", title: "Maintenance and setup", photo: "S02",
    lead: "How repairs, inspections and furnishing get done, from the first quote to photos of the finished work.",
    screen: "/app/ready.webp", screenAlt: "Recharge app: the maintenance team home with repairs and inspections",
    who: ["Our maintenance team", "The setup team that gets a new property ready for its first guest"],
    steps: ["A problem is reported", "Repair approved"],
    faqs: [faq(appFaqs, "How are repairs handled?"), faq(ownerFaqs, "Can you furnish my property?")],
    links: [{ href: "/support/report-a-problem", label: "Report a problem", text: "Where a repair often starts." }, { href: "/owners/furnishing-calculator", label: "Furnishing calculator", text: "Everything a guest-ready home needs." }],
  },
  {
    slug: "accounts", team: "accounts", title: "Accounts",
    lead: "How money is matched, invoiced and paid out, so every figure on a statement is real money.",
    who: ["Our accounts team", "Owners see the result in their monthly statement"],
    steps: ["The owner is paid"],
    faqs: [faq(ownerFaqs, "How are owner statements worked out?")],
    links: [{ href: "/owners/example-statement", label: "Example statement", text: "The statement this work produces." }],
  },
];

export const appPage = (slug: string) => appPages.find((p) => p.slug === slug);
export const teamOf = (p: AppPage) => teams.find((t) => t.id === p.team)!;
export const stepsOf = (p: AppPage) => journey.map((s, i) => ({ ...s, n: i + 1 })).filter((s) => p.steps.includes(s.title));
