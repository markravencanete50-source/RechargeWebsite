import Link from "next/link";
import { nav } from "@/content/site";
import { SubNavScroll } from "./SubNavScroll";

// The pages of one section of the menu (Stays, Owners or Support) as a row of tabs under the page title, so each page leads to
// the others in its section. The current page is underlined.
export function SubNav({ section, current }: { section: string; current: string }) {
  const item = nav.find((n) => n.href === section);
  if (!item?.children) return null;
  return (
    <nav className="subnav" aria-label={`${item.label} pages`}>
      <SubNavScroll>
        {item.children.map((c) => (
          <Link key={c.href} href={c.href} aria-current={c.href === current ? "page" : undefined}>{c.label}</Link>
        ))}
      </SubNavScroll>
    </nav>
  );
}

// The other pages in a section, as a ruled list with a line on each. Used on the section's first page.
export function ChildIndex({ section }: { section: string }) {
  const item = nav.find((n) => n.href === section);
  const pages = item?.children?.filter((c) => c.href !== section) ?? [];
  return (
    <ul className="child-index">
      {pages.map((c) => (
        <li key={c.href}>
          <Link href={c.href}>
            <strong>{c.label}</strong>
            <span>{c.text}</span>
            <em aria-hidden>→</em>
          </Link>
        </li>
      ))}
    </ul>
  );
}
