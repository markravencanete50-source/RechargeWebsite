"use client";

import { Plus, Search, X } from "lucide-react";
import { useId, useMemo, useState } from "react";

// What most guests look for first, offered before anything is typed.
const COMMON = ["Wifi", "Free parking", "Kitchen", "Washing machine", "Dishwasher", "TV", "Heating", "Workspace for a laptop", "Hair dryer", "Iron", "Towels", "Bed linen"];
const SHOWN = 8;

// The amenities of one home: the chosen ones as chips with a remove button, a few common ones to add with one tap, and a search
// across every amenity the homes use. Anything not in the list can be added in the home's own words.
export function AmenityPicker({ value, onChange, vocabulary }: { value: string[]; onChange: (next: string[]) => void; vocabulary: string[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const chosen = useMemo(() => new Set(value.map((a) => a.toLowerCase())), [value]);
  const all = useMemo(() => [...new Set([...COMMON, ...vocabulary])], [vocabulary]);

  const options = useMemo(() => {
    const free = all.filter((a) => !chosen.has(a.toLowerCase()));
    if (!q) return free.filter((a) => COMMON.includes(a)).slice(0, SHOWN);
    const starts = free.filter((a) => a.toLowerCase().startsWith(q));
    const contains = free.filter((a) => !a.toLowerCase().startsWith(q) && a.toLowerCase().includes(q));
    return [...starts, ...contains].slice(0, SHOWN);
  }, [all, chosen, q]);
  const exact = all.some((a) => a.toLowerCase() === q) || chosen.has(q);

  const add = (a: string) => { const t = a.trim(); if (t && !chosen.has(t.toLowerCase())) onChange([...value, t]); setQuery(""); };
  const remove = (a: string) => onChange(value.filter((x) => x !== a));

  return (
    <div className="ap">
      {value.length > 0 ? (
        <ul className="ap-chosen" aria-label="Chosen amenities">
          {value.map((a) => <li key={a}>{a}<button type="button" onClick={() => remove(a)} aria-label={`Remove ${a}`}><X size={13} /></button></li>)}
        </ul>
      ) : <p className="ap-empty">No amenities yet. Add the ones this home has.</p>}

      <label className="ap-search" htmlFor={`${id}-q`}>
        <Search size={16} />
        <input id={`${id}-q`} placeholder="Search amenities, or type your own" value={query} maxLength={80}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (options[0] && q) add(options[0]); else if (q) add(query); } }} />
      </label>

      <div className="ap-options">
        {!q && options.length > 0 && <span className="ap-label">Common</span>}
        {options.map((a) => <button key={a} type="button" onClick={() => add(a)}><Plus size={13} /> {a}</button>)}
        {q && !exact && <button type="button" className="ap-custom" onClick={() => add(query)}><Plus size={13} /> Add &ldquo;{query.trim()}&rdquo;</button>}
        {q && options.length === 0 && exact && <span className="ap-label">Already added</span>}
      </div>
    </div>
  );
}
