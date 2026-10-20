"use client";

import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="header" data-scrolled={scrolled}>
      <div className="wrap header-bar">
        <Link href="/" className="header-logo" aria-label="Recharge home">
          <Image src="/brand/recharge-logo-forest.png" alt="Recharge" width={1886} height={366} priority />
        </Link>
        <nav className="header-nav" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={site.phone.href}>{site.phone.display}</a>
          <a className="btn btn-primary" href={site.bookingUrl} target="_blank" rel="noopener">Book a stay</a>
          <button className="menu-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-menu-top">
            <Image src="/brand/recharge-logo-cream.png" alt="Recharge" width={1886} height={359} style={{ width: 150, height: "auto" }} />
            <button className="menu-toggle" style={{ display: "inline-flex", borderColor: "var(--cream)", color: "var(--cream)" }} aria-label="Close menu" onClick={() => setOpen(false)} autoFocus>
              <X size={22} />
            </button>
          </div>
          <nav aria-label="Mobile">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
            ))}
            <Link href="/#contact" onClick={() => setOpen(false)}>Contact</Link>
          </nav>
          <div className="mobile-menu-foot">
            <a className="btn btn-mint" href={site.bookingUrl} target="_blank" rel="noopener">Book a stay</a>
            <a className="btn btn-line-light" href={site.phone.href}><Phone size={18} /> {site.phone.display}</a>
          </div>
        </div>
      )}
    </header>
  );
}
