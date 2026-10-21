import { BadgeCheck, Banknote, Calculator, CalendarCheck, CalendarDays, CalendarRange, ChartColumn, ClipboardCheck, ClipboardList, Database, FileText, Gauge, Handshake, HeartPulse, LayoutDashboard, ListChecks, Mail, MessagesSquare, PackagePlus, Receipt, Rocket, Scale, SearchCheck, ShieldCheck, ShoppingCart, Sofa, Sparkles, Trees, TrendingUp, Users, Workflow, Wrench, type LucideIcon } from "lucide-react";

// The tools inside the Recharge app, written for the public. Taken from the app's own module list
// (lib/modules.ts in the Recharge app repo). Internal-only admin screens, such as channel logins, are left out.

export type Tool = { name: string; does: string; icon: LucideIcon; for: "Owners" | "Recharge team" | "Cleaners" | "Maintenance team" | "Accounts team" };
export type Team = { id: string; name: string; brand: string; lead: string; tools: Tool[] };

export const teams: Team[] = [
  {
    id: "owners",
    name: "For owners",
    brand: "Client portal",
    lead: "Your property, bookings, money and repairs in one secure place.",
    tools: [
      { name: "Client dashboard", does: "One secure view of your portfolio, booking calendar, property performance and onboarding progress.", icon: LayoutDashboard, for: "Owners" },
      { name: "Owner statements", does: "Booking income matched to platform payouts and bank receipts. Statements are issued from cleared funds.", icon: FileText, for: "Owners" },
      { name: "Maintenance approvals", does: "See repair quotes, full reports, scheduled visits and photo evidence when each job is done.", icon: Wrench, for: "Owners" },
      { name: "Furnishing quotes", does: "Review itemised furnishing quotes and accept or reject them from your phone.", icon: ClipboardCheck, for: "Owners" },
      { name: "Mailbox", does: "Post that arrives at your property is photographed during a clean and shown in the app.", icon: Mail, for: "Owners" },
      { name: "Property onboarding", does: "Follow your property from first enquiry through setup and inspection to its first guest.", icon: Rocket, for: "Owners" },
      { name: "Self-furnishing calculator", does: "Turn your layout into a room-by-room checklist of everything a guest-ready home needs.", icon: Calculator, for: "Owners" },
    ],
  },
  {
    id: "stays",
    name: "Bookings and guests",
    brand: "Recharge Stays",
    lead: "How every listing is priced, checked and looked after.",
    tools: [
      { name: "Daily pricing", does: "Empty nights are reviewed every day and every pricing decision is recorded.", icon: TrendingUp, for: "Recharge team" },
      { name: "Listing health checks", does: "Daily checks on every live listing and its reviews, so each one stays ready to book.", icon: HeartPulse, for: "Recharge team" },
      { name: "Weekly performance report", does: "Occupancy, revenue and pricing reviewed for every property, every week.", icon: ChartColumn, for: "Recharge team" },
      { name: "Guest communication centre", does: "Every guest message in one inbox, with live response timers and escalations.", icon: MessagesSquare, for: "Recharge team" },
      { name: "Direct booking reporting", does: "Direct bookings tracked by value, dates and payment status.", icon: CalendarCheck, for: "Recharge team" },
      { name: "Damage claims", does: "Guest damage evidence, claim deadlines and outcomes tracked to the end.", icon: ShieldCheck, for: "Recharge team" },
      { name: "Licensing", does: "Short-term let licence applications, renewals, documents and deadlines tracked for every home.", icon: BadgeCheck, for: "Recharge team" },
      { name: "Property database", does: "Every property's key details and operating notes kept in one place.", icon: Database, for: "Recharge team" },
      { name: "Clean reporting", does: "Cleaning activity, costs, standards and exceptions reviewed for every stay.", icon: Sparkles, for: "Recharge team" },
      { name: "Maintenance reporting", does: "Repair costs, response times and the effect on each property reviewed in one report.", icon: ClipboardList, for: "Recharge team" },
    ],
  },
  {
    id: "cleans",
    name: "Cleaning",
    brand: "Recharge Cleans",
    lead: "How every turnover is planned, checked and paid.",
    tools: [
      { name: "Clean calendar", does: "Departures flow from the booking system into a cleaning calendar. Cleaners are assigned and upload photo evidence.", icon: CalendarDays, for: "Cleaners" },
      { name: "Cleaner performance", does: "Quality, completion and issues tracked by cleaner and by property.", icon: Gauge, for: "Recharge team" },
      { name: "Cleaner database", does: "Every cleaner, their properties and their current quality score.", icon: Users, for: "Recharge team" },
      { name: "Restock requests", does: "Supplies running low are reported during the clean and tracked until they are replaced.", icon: PackagePlus, for: "Cleaners" },
      { name: "Cleaner invoices", does: "Weekly invoices built from approved cleans only.", icon: Receipt, for: "Cleaners" },
      { name: "Clean client database", does: "Cleaning clients, properties and service details kept together.", icon: Database, for: "Recharge team" },
      { name: "New property handover", does: "Every new property is passed to the cleaning team as soon as setup is complete.", icon: Handshake, for: "Recharge team" },
    ],
  },
  {
    id: "ready",
    name: "Maintenance and setup",
    brand: "Recharge Ready",
    lead: "How repairs, inspections and furnishing get done, from quote to finish.",
    tools: [
      { name: "Repairs", does: "Issues raised by the team are quoted, approved and scheduled through to completion.", icon: Wrench, for: "Maintenance team" },
      { name: "Routine maintenance", does: "Safety inspections, gardening, bin collections and recurring checks logged on a form.", icon: ListChecks, for: "Maintenance team" },
      { name: "Maintenance calendar", does: "Inspections, approved repairs and recurring work planned in one calendar.", icon: CalendarRange, for: "Maintenance team" },
      { name: "New property inspection", does: "Every new property is inspected before it takes a booking.", icon: SearchCheck, for: "Maintenance team" },
      { name: "Furnishing board", does: "Furnishing work for new homes tracked from request to finished room.", icon: Sofa, for: "Maintenance team" },
      { name: "Purchase orders", does: "Furnishing is specified, costed, approved and evidenced item by item.", icon: ShoppingCart, for: "Maintenance team" },
      { name: "Bin and garden rounds", does: "New properties are added to recurring bin and garden cycles.", icon: Trees, for: "Maintenance team" },
    ],
  },
  {
    id: "accounts",
    name: "Accounts",
    brand: "Accounts",
    lead: "How money is matched, invoiced and paid out.",
    tools: [
      { name: "Payout reconciliation", does: "Booking revenue matched to channel payouts and bank receipts, with every difference resolved.", icon: Scale, for: "Accounts team" },
      { name: "Approved maintenance", does: "Each completed repair reconciled against its invoice and the owner payout.", icon: Banknote, for: "Accounts team" },
      { name: "Onboarding invoices", does: "Onboarding invoices issued and payment confirmed on the property's journey.", icon: Receipt, for: "Accounts team" },
      { name: "Purchase order accounts", does: "Approved furnishing orders invoiced, paid, and supplier bills settled in order.", icon: Workflow, for: "Accounts team" },
    ],
  },
];

export const allTools = teams.flatMap((t) => t.tools);
export const toolCount = allTools.length;

// One booking, followed through the app. Each step names the tool that handles it.
export const journey: { title: string; text: string; tool: string }[] = [
  { title: "A guest books", text: "The booking lands in the calendar and the owner sees it in their dashboard.", tool: "Client dashboard" },
  { title: "Questions answered", text: "Guest messages arrive in one inbox with a live response timer.", tool: "Guest communication centre" },
  { title: "Checkout triggers a clean", text: "The departure creates a clean, a cleaner is assigned and photos prove the finish.", tool: "Clean calendar" },
  { title: "A problem is reported", text: "A broken item or low stock is raised from the clean, not lost in a message.", tool: "Restock requests" },
  { title: "Repair approved", text: "Maintenance quotes the job and the owner approves it from their phone.", tool: "Maintenance approvals" },
  { title: "The owner is paid", text: "Income is matched to payouts and the statement is issued from cleared funds.", tool: "Owner statements" },
];
