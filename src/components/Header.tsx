"use client";

import { ChevronDown, Menu, Phone, UserRound, X } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site, type NavItem } from "@/content/site";

const isHere = (pathname: string, href: string) => { const path = href.split("#")[0]; return pathname === path || pathname.startsWith(path + "/"); };
// A sub-page marks its menu item as current, unless it is another top-level page (Report a problem is on Support, not Stays).
const tops = nav.map((n) => n.href);
const inItem = (pathname: string, item: NavItem) => isHere(pathname, item.href) || !!item.children?.some((c) => !tops.includes(c.href.split("#")[0]) && isHere(pathname, c.href));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const bar = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

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

  // A dropdown closes on Escape, on a click elsewhere, and when the page changes.
  useEffect(() => { queueMicrotask(() => setGroup(null)); }, [pathname]);
  useEffect(() => {
    if (!group) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setGroup(null);
    const onDown = (e: PointerEvent) => { if (!bar.current?.contains(e.target as Node)) setGroup(null); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onDown); };
  }, [group]);

  const link = (item: NavItem) => {
    const here = inItem(pathname, item);
    return (
      <Link href={item.href} aria-current={here && isHere(pathname, item.href) ? "page" : undefined} data-here={here || undefined}>
        {item.label}
        {here && <motion.span layoutId="nav-mark" className="nav-mark" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
      </Link>
    );
  };

  return (
    <header className="header" data-scrolled={scrolled}>
      <div className="wrap header-bar">
        <Link href="/" className="header-logo" aria-label="Recharge home">
          <Image src="/brand/recharge-logo-forest.png" alt="Recharge" width={1886} height={366} priority />
        </Link>
        <nav className="header-nav" aria-label="Main" ref={bar}>
          {nav.map((item) => item.children ? (
            <div key={item.href} className="nav-group" data-open={group === item.label || undefined}>
              {link(item)}
              <button type="button" className="nav-more" aria-label={`${item.label} menu`} aria-expanded={group === item.label} onClick={() => setGroup((g) => (g === item.label ? null : item.label))}>
                <ChevronDown size={14} />
              </button>
              <div className="nav-menu">
                {item.children.map((c) => (
                  <Link key={c.href} href={c.href} onClick={() => setGroup(null)}>
                    <strong>{c.label}</strong>
                    {c.text && <span>{c.text}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ) : <div key={item.href} className="nav-group">{link(item)}</div>)}
        </nav>
        <div className="header-actions">
          <a className="header-login" href={site.ownerLogin}><UserRound size={16} /> Owner login</a>
          <a className="header-phone" href={site.phone.href}>{site.phone.display}</a>
          <Link className="btn btn-primary" href="/properties">Book a stay</Link>
          <button className="menu-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>
      {/* Always rendered so the server and browser agree; hidden by CSS for reduced motion. */}
      <motion.span className="scroll-progress" style={{ scaleX: progress }} aria-hidden />
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
              <div key={item.href} className="mm-group">
                <Link href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
                {item.children && (
                  <div className="mm-sub">
                    {item.children.filter((c) => c.href !== item.href).map((c) => <Link key={c.href} href={c.href} onClick={() => setOpen(false)}>{c.label}</Link>)}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="mobile-menu-foot">
            <Link className="btn btn-mint" href="/properties" onClick={() => setOpen(false)}>Book a stay</Link>
            <a className="btn btn-line-light" href={site.phone.href}><Phone size={18} /> {site.phone.display}</a>
            <a className="mobile-login" href={site.ownerLogin}><UserRound size={18} /> Owner login</a>
          </div>
        </div>
      )}
    </header>
  );
}
