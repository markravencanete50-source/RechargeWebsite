"use client";

import { Loader2, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useTransition, type FocusEvent, type FormEvent, type KeyboardEvent } from "react";
import { money } from "@/content/home-utils";

const iso = (d: Date) => d.toISOString().slice(0, 10);

export type SearchValues = { area?: string; checkin?: string; checkout?: string; guests?: string; beds?: string; baths?: string; min?: string; max?: string };
const FILTERS = ["beds", "baths", "min", "max"] as const;
const ease = [0.2, 0.7, 0.2, 1] as const;

type Option = { name: string; sub: string; count: number };
// What the search offers, from the homes on the site (passed in by the page, so no listing data is sent to the browser).
export type SearchOptions = { regions: { name: string; count: number }[]; towns: { name: string; region: string; count: number }[]; priceSteps: number[] };
const HINTS = ["Edinburgh", "Glasgow", "the Scottish Borders", "Aberdeen", "the Isle of Skye", "West Lothian"];

// Where, check in, check out and guests, like the big booking sites, with bedrooms, bathrooms and
// a price range under Filters. A highlight glides to whichever part you are in, "Where" suggests
// areas and towns as you type, and the button shows the search running. Sends it to /properties.
export function SearchBar({ initial, compact, data }: { initial?: SearchValues; compact?: boolean; data: SearchOptions }) {
  const { priceSteps } = data;
  const AREAS = useMemo<Option[]>(() => data.regions.map((r) => ({ name: r.name, sub: "Area", count: r.count })), [data.regions]);
  const TOWNS = useMemo<Option[]>(() => data.towns.filter((t) => !data.regions.some((r) => r.name === t.name)).map((t) => ({ name: t.name, sub: t.region, count: t.count })), [data]);
  const router = useRouter();
  const reduce = useReducedMotion();
  const uid = useId();
  const [pending, startTransition] = useTransition();
  const [checkin, setCheckin] = useState(initial?.checkin ?? "");
  const [min, setMin] = useState(initial?.min ?? "");
  const active = FILTERS.filter((k) => initial?.[k]).length;
  const [open, setOpen] = useState(active > 0);
  const [focused, setFocused] = useState<string | null>(null);
  const [query, setQuery] = useState(initial?.area ?? "");
  const [listOpen, setListOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [hint, setHint] = useState(0);
  const checkinRef = useRef<HTMLInputElement>(null);

  // The rolling hint in "Where", while it is empty and not in use.
  useEffect(() => {
    if (reduce || query || focused === "area") return;
    const t = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 2600);
    return () => clearInterval(t);
  }, [reduce, query, focused]);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AREAS.slice(0, 7);
    return [...AREAS, ...TOWNS].filter((o) => o.name.toLowerCase().includes(q)).sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)) || b.count - a.count).slice(0, 7);
  }, [query, AREAS, TOWNS]);

  const choose = (o: Option) => {
    setQuery(o.name);
    setListOpen(false);
    checkinRef.current?.focus();
  };

  const onAreaKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setListOpen(true); setCursor((c) => Math.min(c + 1, options.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && listOpen && options[cursor]) { e.preventDefault(); choose(options[cursor]); }
    if (e.key === "Escape") setListOpen(false);
  };

  // Past dates can't be picked. Set on focus, so the server and browser render the same page.
  const noPast = (e: FocusEvent<HTMLInputElement>) => { if (!e.currentTarget.min) e.currentTarget.min = iso(new Date()); };
  const focus = (name: string) => () => setFocused(name);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [k, v] of new FormData(e.currentTarget)) if (typeof v === "string" && v) params.set(k, v);
    // A typed area that is not an exact name becomes the best suggestion, or is left out.
    const typed = query.trim().toLowerCase();
    const match = [...AREAS, ...TOWNS].find((o) => o.name.toLowerCase() === typed) ?? (typed ? options[0] : undefined);
    if (match) params.set("area", match.name); else params.delete("area");
    setListOpen(false);
    startTransition(() => router.push(`/properties${params.size ? `?${params}` : ""}`));
  }

  const glow = (name: string) => focused === name && <motion.span layoutId="search-focus" className="search-focus" transition={{ type: "spring", stiffness: 420, damping: 36 }} />;

  return (
    <LayoutGroup id={uid}>
      <form className={`search-wrap${compact ? " compact" : ""}${pending ? " is-pending" : ""}`} onSubmit={submit} role="search" aria-label="Find a stay" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(null); }}>
        <div className="search">
          <div className="search-field search-where" onFocus={focus("area")}>
            {glow("area")}
            <label htmlFor={`${uid}-area`}>Where</label>
            <div className="where-input">
              <input
                id={`${uid}-area`}
                role="combobox"
                aria-expanded={listOpen}
                aria-controls={`${uid}-list`}
                aria-autocomplete="list"
                aria-activedescendant={listOpen && options[cursor] ? `${uid}-opt-${cursor}` : undefined}
                autoComplete="off"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setListOpen(true); setCursor(0); }}
                onFocus={() => setListOpen(true)}
                onBlur={() => setListOpen(false)}
                onKeyDown={onAreaKey}
              />
              {!query && (
                <span className="where-hint" aria-hidden>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={focused === "area" ? "any" : hint} initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-110%", opacity: 0 }} transition={{ duration: 0.45, ease }}>
                      {focused === "area" ? "Search areas or towns" : `Try ${HINTS[hint]}`}
                    </motion.span>
                  </AnimatePresence>
                </span>
              )}
            </div>
            <AnimatePresence>
              {listOpen && options.length > 0 && (
                <motion.ul
                  id={`${uid}-list`}
                  role="listbox"
                  className="where-list"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.22, ease }}
                >
                  {options.map((o, i) => (
                    <motion.li
                      key={o.name}
                      id={`${uid}-opt-${i}`}
                      role="option"
                      aria-selected={i === cursor}
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.25, ease }}
                      onMouseDown={(e) => { e.preventDefault(); choose(o); }}
                      onMouseEnter={() => setCursor(i)}
                    >
                      <span className="where-pin"><MapPin size={16} /></span>
                      <span className="where-name"><strong>{o.name}</strong><small>{o.sub}</small></span>
                      <em>{o.count} {o.count === 1 ? "home" : "homes"}</em>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <div className="search-field" onFocus={focus("in")}>
            {glow("in")}
            <label htmlFor={`${uid}-in`}>Check in</label>
            <input ref={checkinRef} id={`${uid}-in`} name="checkin" type="date" value={checkin} onFocus={noPast} onChange={(e) => setCheckin(e.target.value)} />
          </div>
          <div className="search-field" onFocus={focus("out")}>
            {glow("out")}
            <label htmlFor={`${uid}-out`}>Check out</label>
            <input id={`${uid}-out`} name="checkout" type="date" min={checkin || undefined} onFocus={noPast} defaultValue={initial?.checkout ?? ""} />
          </div>
          <div className="search-field" onFocus={focus("guests")}>
            {glow("guests")}
            <label htmlFor={`${uid}-guests`}>Guests</label>
            <select id={`${uid}-guests`} name="guests" defaultValue={initial?.guests ?? ""}>
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n === 8 ? "8 or more" : n}</option>)}
            </select>
          </div>
          <button type="button" className="search-more" aria-expanded={open} aria-controls={`${uid}-filters`} onClick={() => setOpen((o) => !o)}>
            <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3, ease }} style={{ display: "inline-flex" }}><SlidersHorizontal size={18} /></motion.span>
            <span>Filters</span>
            <AnimatePresence>{active > 0 && <motion.em initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>{active}</motion.em>}</AnimatePresence>
          </button>
          <motion.button className="search-btn" type="submit" whileTap={reduce ? undefined : { scale: 0.94 }} aria-busy={pending}>
            <AnimatePresence mode="wait" initial={false}>
              {pending
                ? <motion.span key="busy" className="search-btn-in" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><Loader2 size={20} className="spin" /><span>Searching</span></motion.span>
                : <motion.span key="idle" className="search-btn-in" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><Search size={20} /><span>Search</span></motion.span>}
            </AnimatePresence>
          </motion.button>
        </div>
        <motion.div
          id={`${uid}-filters`}
          className="search-filters-shell"
          initial={false}
          animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35, ease }}
          inert={!open}
        >
          <div className="search-filters">
            <label>Bedrooms
              <select name="beds" defaultValue={initial?.beds ?? ""}>
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </label>
            <label>Bathrooms
              <select name="baths" defaultValue={initial?.baths ?? ""}>
                <option value="">Any</option>
                {[1, 2, 3].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </label>
            <label>Minimum price
              <select name="min" value={min} onChange={(e) => setMin(e.target.value)}>
                <option value="">No minimum</option>
                {priceSteps.map((p) => <option key={p} value={p}>{money(p)} a night</option>)}
              </select>
            </label>
            <label>Maximum price
              <select name="max" defaultValue={initial?.max ?? ""}>
                <option value="">No maximum</option>
                {priceSteps.filter((p) => !min || p > Number(min)).map((p) => <option key={p} value={p}>{money(p)} a night</option>)}
              </select>
            </label>
          </div>
        </motion.div>
      </form>
    </LayoutGroup>
  );
}
