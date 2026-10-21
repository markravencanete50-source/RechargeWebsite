"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { homes, money, regions } from "@/content/properties";
import { site } from "@/content/site";
import { HomeCard } from "./HomeCard";
import { SearchBar } from "./SearchBar";

// The search, the filters and every matching home, driven by the address bar.
export function PropertyResults() {
  const params = useSearchParams();
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
        <Link href={withArea("")} className="tab" aria-current={!area ? "page" : undefined}>All areas <span className="tab-count">{homes.length}</span></Link>
        {regions.map((r) => (
          <Link key={r.name} href={withArea(r.name)} className="tab" aria-current={area === r.name ? "page" : undefined}>{r.name} <span className="tab-count">{r.count}</span></Link>
        ))}
      </div>
      <div className="results-bar">
        <p className="muted results-count">{list.length} {list.length === 1 ? "home" : "homes"}{area ? ` in ${area}` : " across Scotland"}</p>
        {chips.length > 0 && (
          <div className="active-filters">
            {chips.map((c) => <Link key={c.key} href={without(c.key)} className="chip-x" aria-label={`Remove ${c.label}`}>{c.label} <X size={14} /></Link>)}
            <Link href={area ? `/properties?area=${encodeURIComponent(area)}` : "/properties"} className="text-link">Clear filters</Link>
          </div>
        )}
      </div>
      {list.length ? (
        <div className="homes">{list.map((h, i) => <HomeCard key={h.slug} home={h} priority={i < 4} />)}</div>
      ) : (
        <div className="empty">
          <strong className="h3">No homes match that search</strong>
          <p className="muted">Try another area or loosen a filter, or call us on {site.phone.display} and we will find you somewhere.</p>
          <Link className="btn btn-ghost" href="/properties">See all homes</Link>
        </div>
      )}
    </>
  );
}
