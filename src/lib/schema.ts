import type { Faq } from "@/content/faqs";
import { site } from "@/content/site";

export const abs = (path: string) => new URL(path, site.url).toString();

export const organization = {
  "@type": "LodgingBusiness",
  "@id": abs("/#organization"),
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: site.phone.href.replace("tel:", ""),
  logo: abs("/icon.svg"),
  areaServed: { "@type": "Country", name: "Scotland" },
  address: { "@type": "PostalAddress", addressRegion: "Scotland", addressCountry: "GB" },
  description: "Serviced accommodation and short-let property management across Scotland, run through the Recharge app with 24/7 support.",
  knowsAbout: ["Serviced accommodation", "Short-term lets", "Guaranteed rent", "Airbnb management", "Short-term let licensing in Scotland"],
};

export function faqPage(items: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.path) })),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
