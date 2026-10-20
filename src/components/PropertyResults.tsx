"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { homes } from "@/content/photos";
import { site } from "@/content/site";
import { HomeCard } from "./HomeCard";
import { SearchBar } from "./SearchBar";

// The search bar and the matching homes, filtered by the search in the address bar.
export function PropertyResults() {
  const params = useSearchParams();
  const area = params.get("area") ?? "";
  const guests = Number(params.get("guests") ?? 0);
  const initial = { area, checkin: params.get("checkin") ?? "", checkout: params.get("checkout") ?? "", guests: params.get("guests") ?? "" };
  const list = homes.filter((h) => (!area || h.area === area) && (!guests || !h.sleeps || h.sleeps >= guests));

  return (
    <>
      <SearchBar key={params.toString()} initial={initial} compact />
      <div className="area-filter" aria-label="Filter by area">
        <Link href="/properties" className="tab" aria-current={!area ? "page" : undefined}>All areas</Link>
        {site.areas.map((a) => (
          <Link key={a} href={`/properties?area=${encodeURIComponent(a)}`} className="tab" aria-current={area === a ? "page" : undefined}>{a}</Link>
        ))}
      </div>
      <p className="muted results-count">{list.length} {list.length === 1 ? "home" : "homes"}{area ? ` in ${area}` : ""}</p>
      {list.length ? (
        <div className="homes">{list.map((h, i) => <HomeCard key={h.slug} home={h} priority={i < 4} />)}</div>
      ) : (
        <div className="empty">
          <strong className="h3">No homes match that search yet</strong>
          <p className="muted">Try another area, or call us on {site.phone.display} and we will find you somewhere.</p>
          <Link className="btn btn-ghost" href="/properties">See all homes</Link>
        </div>
      )}
    </>
  );
}
