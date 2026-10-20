import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

// Worked out when the site is built, so it updates with each deploy.
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
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
              <li><Link href="/stay">Stays</Link></li>
              <li><Link href="/support">24/7 support</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3>Owners</h3>
            <ul>
              <li><Link href="/owners">Guaranteed rent</Link></li>
              <li><Link href="/owners">Full management</Link></li>
              <li><Link href="/app">The Recharge app</Link></li>
              <li><Link href="/owners#contact">Get an estimate</Link></li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              <li><a href={site.phone.href}>{site.phone.display}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li>{site.areas.join(", ")}</li>
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
