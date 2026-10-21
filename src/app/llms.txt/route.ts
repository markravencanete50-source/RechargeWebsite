import { generalFaqs, guestFaqs, ownerFaqs } from "@/content/faqs";
import { heading, homes, regions, regionSlug } from "@/content/properties";
import { site } from "@/content/site";
import { teams, toolCount } from "@/content/tools";
import { abs } from "@/lib/schema";

// A plain-text summary of the site for AI assistants and answer engines (llmstxt.org).
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> Serviced accommodation and short-let property management across Scotland. ${homes.length} homes in ${regions.length} areas, run through the Recharge app (${toolCount} tools) with 24/7 support. Book direct and save ${site.directDiscount}.`,
    "",
    `Phone: ${site.phone.display}. Email: ${site.email}.`,
    "",
    "## Main pages",
    `- [Properties](${abs("/properties")}): search all ${homes.length} homes by area, dates, guests, bedrooms, bathrooms and price.`,
    `- [Stays](${abs("/stay")}): how booking and staying with Recharge works.`,
    `- [Owners](${abs("/owners")}): guaranteed rent or full management, and the free performance estimate.`,
    `- [The Recharge app](${abs("/app")}): every tool the app has, by team.`,
    `- [Support](${abs("/support")}): 24/7 help for guests and owners.`,
    `- [FAQ](${abs("/faq")}): answers for guests, owners and about the app.`,
    "",
    "## Areas",
    ...regions.map((r) => `- [${r.name}](${abs(`/properties/area/${regionSlug(r.name)}`)}): ${r.count} homes`),
    "",
    "## App tools",
    ...teams.flatMap((t) => [`### ${t.name}`, ...t.tools.map((tool) => `- ${tool.name}: ${tool.does}`)]),
    "",
    "## Common questions",
    ...[...generalFaqs, ...guestFaqs, ...ownerFaqs].flatMap((f) => [`### ${f.q}`, f.a]),
    "",
    "## Homes",
    ...homes.map((h) => `- [${heading(h)}, ${h.region}](${abs(`/properties/${h.slug}`)})${h.guests ? `: sleeps ${h.guests}` : ""}`),
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
