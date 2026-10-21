"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { homes, regions } from "@/content/properties";
import { site } from "@/content/site";
import { HomeCard } from "./HomeCard";
import { SearchBar } from "./SearchBar";

// The search, the filters and every matching home, driven by the address bar.
export function PropertyResults() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const area = params.get("area") ?? "";
  const guests = Number(params.get("guests") ?? 0);
  const beds = Number(params.get("beds") ?? 0);
  const initial = { area, checkin: params.get("checkin") ?? "", checkout: params.get("checkout") ?? "", guests: params.get("guests") ?? "" };
  const list = homes.filter((h) => (!area || h.region === area || h.town === area) && (!guests || (h.guests ?? h.bedrooms * 2) >= guests) && (!beds || h.bedrooms >= beds));
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    router.replace(`${path}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  return (
    <>
      <SearchBar key={params.toString()} initial={initial} compact />
      <div className="filters">
        <div className="area-filter" aria-label="Filter by area">
          <Link href="/properties" className="tab" aria-current={!area ? "page" : undefined}>All areas <span className="tab-count">{homes.length}</span></Link>
          {regions.map((r) => (
            <Link key={r.name} href={`/properties?area=${encodeURIComponent(r.name)}`} className="tab" aria-current={area === r.name ? "page" : undefined}>{r.name} <span className="tab-count">{r.count}</span></Link>
          ))}
        </div>
        <label className="filter-select">Bedrooms
          <select value={beds || ""} onChange={(e) => set("beds", e.target.value)}>
            <option value="">Any</option>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </label>
      </div>
      <p className="muted results-count">{list.length} {list.length === 1 ? "home" : "homes"}{area ? ` in ${area}` : " across Scotland"}</p>
      {list.length ? (
        <div className="homes">{list.map((h, i) => <HomeCard key={h.slug} home={h} priority={i < 4} />)}</div>
      ) : (
        <div className="empty">
          <strong className="h3">No homes match that search</strong>
          <p className="muted">Try another area or fewer guests, or call us on {site.phone.display} and we will find you somewhere.</p>
          <Link className="btn btn-ghost" href="/properties">See all homes</Link>
        </div>
      )}
    </>
  );
}
