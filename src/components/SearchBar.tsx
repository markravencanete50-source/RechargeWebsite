"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FocusEvent, type FormEvent } from "react";
import { regions } from "@/content/properties";

const iso = (d: Date) => d.toISOString().slice(0, 10);

// Where, check in, check out and guests, like the big booking sites. Sends the search to /properties.
export function SearchBar({ initial, compact }: { initial?: { area?: string; checkin?: string; checkout?: string; guests?: string }; compact?: boolean }) {
  const router = useRouter();
  const [checkin, setCheckin] = useState(initial?.checkin ?? "");
  // Past dates can't be picked. Set on focus, so the server and browser render the same page.
  const noPast = (e: FocusEvent<HTMLInputElement>) => { if (!e.currentTarget.min) e.currentTarget.min = iso(new Date()); };

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [k, v] of new FormData(e.currentTarget)) if (typeof v === "string" && v) params.set(k, v);
    router.push(`/properties${params.size ? `?${params}` : ""}`);
  }

  return (
    <form className={compact ? "search search-compact" : "search"} onSubmit={submit} role="search" aria-label="Find a stay">
      <div className="search-field">
        <label htmlFor="s-area">Where</label>
        <select id="s-area" name="area" defaultValue={initial?.area ?? ""}>
          <option value="">Anywhere</option>
          {regions.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="s-in">Check in</label>
        <input id="s-in" name="checkin" type="date" value={checkin} onFocus={noPast} onChange={(e) => setCheckin(e.target.value)} />
      </div>
      <div className="search-field">
        <label htmlFor="s-out">Check out</label>
        <input id="s-out" name="checkout" type="date" min={checkin || undefined} onFocus={noPast} defaultValue={initial?.checkout ?? ""} />
      </div>
      <div className="search-field">
        <label htmlFor="s-guests">Guests</label>
        <select id="s-guests" name="guests" defaultValue={initial?.guests ?? ""}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n === 8 ? "8 or more" : n}</option>)}
        </select>
      </div>
      <button className="search-btn" type="submit"><Search size={20} /><span>Search</span></button>
    </form>
  );
}
