import Image from "next/image";
import Link from "next/link";
import { regionSlug } from "@/content/home-utils";
import { getCatalog } from "@/content/catalog";
import { site } from "@/content/site";

// Worked out when the site is built, so it updates with each deploy.
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const { regions } = await getCatalog();
  const { company } = site;
  const year = await currentYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Image className="footer-logo" src="/brand/recharge-logo-cream.png" alt="Recharge" width={1886} height={359} />
            <p style={{ margin: 0, maxWidth: 34 + "ch" }}>Serviced accommodation and property management across Scotland, run through one app with support 24/7.</p>
          </div>
          <div>
            <h3>Guests</h3>
            <ul>
              <li><Link href="/properties">Properties</Link></li>
              <li><Link href="/properties/areas">Browse by area</Link></li>
              <li><Link href="/properties/choosing-a-home">Choosing a home</Link></li>
              <li><Link href="/properties/prices">How our prices work</Link></li>
              <li><Link href="/stay">Stays</Link></li>
              <li><Link href="/stay/book-direct">Book direct and save</Link></li>
              <li><Link href="/stay/check-in">Check-in and house rules</Link></li>
              <li><Link href="/support">24/7 support</Link></li>
              <li><Link href="/support/report-a-problem">Report a problem</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/about/where-we-work">Where we work</Link></li>
              <li><Link href="/about/contact">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h3>Owners</h3>
            <ul>
              <li><a href={site.ownerLogin}>Owner login</a></li>
              <li><Link href="/guaranteed-rent">Guaranteed rent</Link></li>
              <li><Link href="/owners/full-management">Full management</Link></li>
              <li><Link href="/app">The Recharge app</Link></li>
              <li><Link href="/app/how-it-works">How the app works</Link></li>
              <li><Link href="/app/owner-portal">Owner portal</Link></li>
              <li><Link href="/owners/earnings-calculator">Earnings calculator</Link></li>
              <li><Link href="/owners#estimate">Free estimate</Link></li>
              <li><Link href="/owners/furnishing-calculator">Furnishing calculator</Link></li>
            </ul>
          </div>
          <div>
            <h3>Popular areas</h3>
            <ul>
              {regions.slice(0, 6).map((r) => <li key={r.name}><Link href={`/properties/area/${regionSlug(r.name)}`}>{r.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              <li><a href={site.phone.href}>{site.phone.display}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li>Homes across Scotland</li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>&copy; {year} {company.legalName || site.name}. All rights reserved.</span>
          {company.number && <span>Registered in Scotland, company number {company.number}. {company.registeredOffice}</span>}
        </div>
      </div>
    </footer>
  );
}
