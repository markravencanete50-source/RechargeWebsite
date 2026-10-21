"use client";

import { SearchX, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { homes, money, regions } from "@/content/properties";
import { site } from "@/content/site";
import { HomeCard } from "./HomeCard";
import { RollingNumber } from "./RollingNumber";
import { RevealCard, SearchSequence } from "./SearchSequence";
import { SearchBar } from "./SearchBar";

const ease = [0.2, 0.7, 0.2, 1] as const;

// The search, the filters and every matching home, driven by the address bar. When the search
// changes, a sweep runs across the results, the count rolls and the homes glide to new places.
export function PropertyResults() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const get = (k: string) => params.get(k) ?? "";
  const num = (k: string) => Number(params.get(k) ?? 0);
  const area = get("area");
  const [guests, beds, baths, min, max] = [num("guests"), num("beds"), num("baths"), num("min"), num("max")];
  const initial = { area, checkin: get("checkin"), checkout: get("checkout"), guests: get("guests"), beds: get("beds"), baths: get("baths"), min: get("min"), max: get("max") };

  const list = homes.filter((h) =>
    (!area || h.region === area || h.town === area) &&
    (!guests || (h.guests ?? h.bedrooms * 2) >= guests) &&
    (!beds || h.bedrooms >= beds) &&
    (!baths || h.bathrooms === undefined || h.bathrooms >= baths) &&
    // A home without a price in Hostaway can't be checked against a price range, so it is left out of one.
    (!min || (h.price !== undefined && h.price >= min)) &&
    (!max || (h.price !== undefined && h.price <= max)),
  );

  // The filters in use, each removable on its own.
  const without = (key: string) => {
    const next = new URLSearchParams(params);
    next.delete(key);
    return `/properties${next.size ? `?${next}` : ""}`;
  };
  const chips = [
    guests && { key: "guests", label: `${guests}+ guests` },
    beds && { key: "beds", label: `${beds}+ bedrooms` },
    baths && { key: "baths", label: `${baths}+ bathrooms` },
    min && { key: "min", label: `From ${money(min)}` },
    max && { key: "max", label: `Up to ${money(max)}` },
  ].filter(Boolean) as { key: string; label: string }[];
  const withArea = (name: string) => {
    const next = new URLSearchParams(params);
    if (name) next.set("area", name); else next.delete("area");
    return `/properties${next.size ? `?${next}` : ""}`;
  };

  return (
    <>
      <SearchBar key={params.toString()} initial={initial} compact />
      <div className="area-filter area-scroll" aria-label="Filter by area">
        <Link href={withArea("")} className="tab tab-glide" aria-current={!area ? "page" : undefined}>
          {!area && <motion.span layoutId="area-pill" className="tab-pill" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
          <span>All areas <span className="tab-count">{homes.length}</span></span>
        </Link>
        {regions.map((r) => (
          <Link key={r.name} href={withArea(r.name)} className="tab tab-glide" aria-current={area === r.name ? "page" : undefined}>
            {area === r.name && <motion.span layoutId="area-pill" className="tab-pill" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
            <span>{r.name} <span className="tab-count">{r.count}</span></span>
          </Link>
        ))}
      </div>
      <div className="results-bar">
        <p className="muted results-count" aria-live="polite"><RollingNumber value={list.length} /> {list.length === 1 ? "home" : "homes"}{area ? ` in ${area}` : " across Scotland"}</p>
        <div className="active-filters">
          <AnimatePresence initial={false}>
            {chips.map((c) => (
              <motion.span key={c.key} layout initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 420, damping: 28 }}>
                <Link href={without(c.key)} className="chip-x" aria-label={`Remove ${c.label}`}>{c.label} <X size={14} /></Link>
              </motion.span>
            ))}
          </AnimatePresence>
          {chips.length > 0 && <Link href={area ? `/properties?area=${encodeURIComponent(area)}` : "/properties"} className="text-link">Clear filters</Link>}
        </div>
      </div>
      <div className="results-stage">
        <SearchSequence key={params.toString()} place={area ? `in ${area}` : "across Scotland"} count={list.length}>
          {list.length ? (
            <div className="homes">
              {list.map((h, i) => (
                <RevealCard key={h.slug} index={i}>
                  <HomeCard home={h} priority={i < 4} />
                </RevealCard>
              ))}
            </div>
          ) : (
            <motion.div className="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
              <motion.span className="empty-ic" animate={reduce ? undefined : { rotate: [0, -12, 10, -6, 0] }} transition={{ duration: 1.2, delay: 0.2 }}><SearchX size={28} /></motion.span>
              <strong className="h3">No homes match that search</strong>
              <p className="muted">Try another area or loosen a filter, or call us on {site.phone.display} and we will find you somewhere.</p>
              <Link className="btn btn-ghost" href="/properties">See all homes</Link>
            </motion.div>
          )}
        </SearchSequence>
      </div>
    </>
  );
}
