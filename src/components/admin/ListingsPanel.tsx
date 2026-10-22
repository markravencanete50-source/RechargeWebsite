"use client";

import { Check, EyeOff, Globe, Loader2, Plus, RotateCcw, Search, Star, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch, supabase } from "@/lib/supabase-browser";
import { WebsiteListingEditor, type WebsiteRow } from "./WebsiteListingEditor";

type Base = { hostawayId: number; slug: string; title: string; description: string; amenities: string[]; photo: string | null; region: string; town: string; bedrooms: number; price: number | null };
type Override = { hostaway_id: number; published: boolean; featured_rank: number | null; title: string | null; description: string | null; amenities: string[] | null };
type Filter = "all" | "shown" | "hidden" | "featured" | "edited" | "website";

// Every Hostaway home, with what the website shows for it: shown or hidden, featured, and any edited text or amenities. Below
// them, the homes added in the dashboard only.
export function ListingsPanel() {
  const [base, setBase] = useState<Base[] | null>(null);
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<Map<number, Override>>(new Map());
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Base | null>(null);
  const [own, setOwn] = useState<WebsiteRow[]>([]);
  const [openOwn, setOpenOwn] = useState<WebsiteRow | "new" | null>(null);

  const load = useCallback(async () => {
    setError("");
    const [res, ov, web] = await Promise.all([
      adminFetch("/api/admin/listings"),
      supabase.from("listing_overrides").select("hostaway_id,published,featured_rank,title,description,amenities"),
      supabase.from("website_listings").select("id,slug,published,featured_rank,data").order("created_at"),
    ]);
    if (!res.ok) { setError("The listings could not be loaded. Sign out and in again."); return; }
    const data = await res.json();
    setBase(data.listings); setVocabulary(data.vocabulary);
    setOverrides(new Map((ov.data ?? []).map((o: Override) => [o.hostaway_id, o])));
    setOwn((web.data ?? []) as WebsiteRow[]);
  }, []);
  useEffect(() => { queueMicrotask(load); }, [load]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (filter === "website") return [];
    return (base ?? []).filter((b) => {
      const o = overrides.get(b.hostawayId);
      const text = `${o?.title ?? b.title} ${b.town} ${b.region} ${b.hostawayId}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (filter === "shown") return o?.published !== false;
      if (filter === "hidden") return o?.published === false;
      if (filter === "featured") return !!o?.featured_rank;
      if (filter === "edited") return !!(o?.title || o?.description || o?.amenities);
      return true;
    }).sort((a, b) => (overrides.get(a.hostawayId)?.featured_rank ?? 1000) - (overrides.get(b.hostawayId)?.featured_rank ?? 1000));
  }, [base, overrides, query, filter]);
  const ownRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return own.filter((w) => {
      if (q && !`${w.data.title} ${w.data.town} ${w.data.region} ${w.slug}`.toLowerCase().includes(q)) return false;
      if (filter === "shown") return w.published;
      if (filter === "hidden") return !w.published;
      if (filter === "featured") return !!w.featured_rank;
      return filter !== "edited";
    });
  }, [own, query, filter]);
  const places = useMemo(() => {
    const towns = new Map<string, string>();
    for (const b of base ?? []) towns.set(b.town, b.region);
    return { regions: [...new Set((base ?? []).map((b) => b.region))].sort(), towns: [...towns].map(([name, region]) => ({ name, region })).sort((a, b) => a.name.localeCompare(b.name)) };
  }, [base]);

  if (error) return <p className="adm-note error">{error}</p>;
  if (!base) return <div className="adm-center"><Loader2 className="spin" /></div>;
  const counts = { all: base.length, hidden: base.filter((b) => overrides.get(b.hostawayId)?.published === false).length, featured: base.filter((b) => overrides.get(b.hostawayId)?.featured_rank).length };

  return (
    <section>
      <header className="adm-head">
        <div><h1>Listings</h1><p className="adm-muted">{counts.all} homes from Hostaway · {counts.all - counts.hidden} on the website · {counts.featured} featured{own.length ? ` · ${own.length} added here` : ""}</p></div>
        <button type="button" className="adm-btn primary" onClick={() => setOpenOwn("new")}><Plus size={16} /> Add a listing</button>
      </header>
      <div className="adm-tools">
        <label className="adm-search"><Search size={16} /><input placeholder="Search by name, town or Hostaway ID" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
        <div className="adm-chips">
          {(["all", "shown", "hidden", "featured", "edited", "website"] as Filter[]).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === "website" ? "Added here" : f[0].toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>
      {ownRows.length > 0 && (
        <>
          <h2 className="adm-sub">Added in the dashboard</h2>
          <ul className="adm-list">
            {ownRows.map((w) => (
              <li key={w.id}>
                <button type="button" onClick={() => setOpenOwn(w)}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- small admin thumbnails, no need for the image optimiser */}
                  <span className="adm-thumb">{w.data.photos?.[0] && <img src={w.data.photos[0].src} alt="" loading="lazy" />}</span>
                  <span className="adm-row-main">
                    <strong>{w.data.title}</strong>
                    <small>{w.data.town}, {w.data.region} · {w.data.bedrooms ?? 0} bed{w.data.bedrooms === 1 ? "" : "s"}{w.data.price ? ` · around £${w.data.price}` : ""}</small>
                  </span>
                  <span className="adm-badges">
                    <em><Globe size={13} /> Website only</em>
                    {!w.published && <em className="hidden"><EyeOff size={13} /> Draft</em>}
                    {w.featured_rank && <em className="featured"><Star size={13} /> Featured {w.featured_rank}</em>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {rows.length > 0 && <h2 className="adm-sub">From Hostaway</h2>}
        </>
      )}
      {filter === "website" && ownRows.length === 0 && <p className="adm-muted">No listings added here yet. Use Add a listing for a home that is not in Hostaway.</p>}
      <ul className="adm-list">
        {rows.map((b) => {
          const o = overrides.get(b.hostawayId);
          return (
            <li key={b.hostawayId}>
              <button type="button" onClick={() => setOpen(b)}>
                {/* eslint-disable-next-line @next/next/no-img-element -- small admin thumbnails, no need for the image optimiser */}
                <span className="adm-thumb">{b.photo && <img src={b.photo} alt="" loading="lazy" />}</span>
                <span className="adm-row-main">
                  <strong>{o?.title ?? b.title}</strong>
                  <small>{b.town}, {b.region} · {b.bedrooms} bed{b.bedrooms === 1 ? "" : "s"}{b.price ? ` · around £${b.price}` : ""} · #{b.hostawayId}</small>
                </span>
                <span className="adm-badges">
                  {o?.published === false && <em className="hidden"><EyeOff size={13} /> Hidden</em>}
                  {o?.featured_rank && <em className="featured"><Star size={13} /> Featured {o.featured_rank}</em>}
                  {(o?.title || o?.description || o?.amenities) && <em>Edited</em>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {openOwn && (
        <WebsiteListingEditor row={openOwn === "new" ? null : openOwn} vocabulary={vocabulary} regions={places.regions} towns={places.towns}
          takenSlugs={new Set([...base.map((b) => b.slug), ...own.map((w) => w.slug)])} onClose={() => setOpenOwn(null)} onSaved={load} />
      )}
      {open && <Editor base={open} override={overrides.get(open.hostawayId)} vocabulary={vocabulary} onClose={() => setOpen(null)} onSaved={load} />}
    </section>
  );
}

function Editor({ base, override, vocabulary, onClose, onSaved }: { base: Base; override?: Override; vocabulary: string[]; onClose: () => void; onSaved: () => Promise<void> }) {
  const [published, setPublished] = useState(override?.published !== false);
  const [featured, setFeatured] = useState(!!override?.featured_rank);
  const [rank, setRank] = useState(String(override?.featured_rank ?? 1));
  const [title, setTitle] = useState(override?.title ?? base.title);
  const [description, setDescription] = useState(override?.description ?? base.description);
  const [amenities, setAmenities] = useState<string[]>(override?.amenities ?? base.amenities);
  const [extra, setExtra] = useState("");
  const [hostaway, setHostaway] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const all = useMemo(() => [...new Set([...amenities, ...vocabulary])].sort((a, b) => a.localeCompare(b)), [amenities, vocabulary]);
  const textChanged = title.trim() !== base.title || description.trim() !== base.description || amenities.length !== base.amenities.length || amenities.some((a) => !base.amenities.includes(a));
  const toggle = (a: string) => setAmenities((list) => (list.includes(a) ? list.filter((x) => x !== a) : [...list, a]));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save(reset = false) {
    const toHostaway = hostaway && !reset && textChanged;
    if (toHostaway && !window.confirm("This also changes the listing in Hostaway, which updates it on Airbnb and Booking.com. Continue?")) return;
    setBusy(true); setResult(null);
    const res = await adminFetch("/api/admin/listing", {
      method: "POST",
      body: JSON.stringify({
        hostawayId: base.hostawayId, published, featuredRank: featured ? rank : null,
        title: reset ? null : title, description: reset ? null : description, amenities: reset ? null : amenities, hostaway: toHostaway,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setResult({ tone: "error", text: data.error ?? "Not saved. Try again." }); return; }
    await onSaved();
    if (reset) { setTitle(base.title); setDescription(base.description); setAmenities(base.amenities); }
    const h = data.hostaway;
    const hostawayText = !h ? "" : h.error ? ` Hostaway was not updated: ${h.error}` : h.sent?.length ? ` Hostaway updated: ${h.sent.join(", ")}.${h.unmatched?.length ? ` Not in Hostaway's amenity list, so website only: ${h.unmatched.join(", ")}.` : ""}` : "";
    setResult({ tone: h?.error ? "error" : "ok", text: `Saved. The website shows it within a minute.${hostawayText}` });
  }

  return (
    <div className="adm-sheet-back" onClick={onClose}>
      <div className="adm-sheet" role="dialog" aria-modal="true" aria-label={`Edit ${base.title}`} onClick={(e) => e.stopPropagation()}>
        <header>
          <div><strong>{base.town}, {base.region}</strong><small>Hostaway #{base.hostawayId} · <a href={`/properties/${base.slug}`} target="_blank" rel="noopener">View on the website</a></small></div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </header>
        <div className="adm-sheet-body">
          <div className="adm-switches">
            <label className="adm-switch"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /><span /> Show on the website</label>
            <label className="adm-switch"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /><span /> Featured</label>
            {featured && <label className="adm-inline">Position <input type="number" min={1} max={100} value={rank} onChange={(e) => setRank(e.target.value)} /></label>}
          </div>
          <label className="adm-field">Title<input value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} /><small>Hostaway: {base.title}</small></label>
          <label className="adm-field">Description<textarea rows={12} value={description} maxLength={20000} onChange={(e) => setDescription(e.target.value)} /></label>
          <div className="adm-field">
            <span>Amenities <small>{amenities.length} selected</small></span>
            <div className="adm-amen">
              {all.map((a) => (
                <button key={a} type="button" aria-pressed={amenities.includes(a)} onClick={() => toggle(a)}>{amenities.includes(a) && <Check size={13} />}{a}</button>
              ))}
            </div>
            <div className="adm-add">
              <input placeholder="Add another amenity" value={extra} maxLength={80} onChange={(e) => setExtra(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (extra.trim()) { setAmenities((l) => [...new Set([...l, extra.trim()])]); setExtra(""); } } }} />
              <button type="button" className="adm-btn" onClick={() => { if (extra.trim()) { setAmenities((l) => [...new Set([...l, extra.trim()])]); setExtra(""); } }}><Plus size={14} /> Add</button>
            </div>
          </div>
        </div>
        <footer>
          <label className="adm-check"><input type="checkbox" checked={hostaway} onChange={(e) => setHostaway(e.target.checked)} /> Also update Hostaway (and so Airbnb and Booking.com) with text and amenity changes</label>
          {result && <p className={`adm-note ${result.tone}`}>{result.text}</p>}
          <div className="adm-actions">
            <button type="button" className="adm-btn" disabled={busy} onClick={() => save(true)} title="Use Hostaway's title, description and amenities again"><RotateCcw size={14} /> Reset text to Hostaway</button>
            <button type="button" className="adm-btn primary" disabled={busy} onClick={() => save()}>{busy && <Loader2 size={16} className="spin" />} Save</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
