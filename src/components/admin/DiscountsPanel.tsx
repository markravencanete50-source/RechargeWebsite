"use client";

import { BadgePercent, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Discount } from "@/content/catalog";
import { ukToday } from "@/content/discounts";
import { adminFetch, supabase } from "@/lib/supabase-browser";

type Note = { tone: "ok" | "error"; text: string } | null;
const day = (iso: string | null) => (iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "");
const refresh = () => adminFetch("/api/admin/refresh", { method: "POST" });

function status(d: Discount, today: string) {
  if (!d.active) return { text: "Off", tone: "hidden" };
  if (d.starts_on && d.starts_on > today) return { text: `Starts ${day(d.starts_on)}`, tone: "" };
  if (d.ends_on && d.ends_on < today) return { text: "Ended", tone: "hidden" };
  return { text: "Live now", tone: "featured" };
}

// The discounts guests see on the booking card: offers (for today, a date range, or until switched off; for every area or one)
// and the new-guest discount, given the first time an email address sends a booking request. When several offers fit a stay
// only the biggest counts; the new-guest discount is added to it.
export function DiscountsPanel() {
  const [rows, setRows] = useState<Discount[] | null>(null);
  const [regions, setRegions] = useState<string[]>([]);
  const [editing, setEditing] = useState<Discount | "new" | null>(null);
  const [note, setNote] = useState<Note>(null);
  const today = ukToday();

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("discounts").select("id,kind,label,percent,starts_on,ends_on,region,active").order("created_at");
    if (error) { setNote({ tone: "error", text: "The discounts could not be loaded. Sign out and in again." }); return; }
    setRows((data ?? []).map((d) => ({ ...d, percent: Number(d.percent) })) as Discount[]);
  }, []);
  useEffect(() => {
    queueMicrotask(load);
    adminFetch("/api/admin/listings").then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (d) setRegions([...new Set<string>(d.listings.map((l: { region: string }) => l.region))].sort());
    });
  }, [load]);

  if (!rows) return note ? <p className="adm-note error">{note.text}</p> : <div className="adm-center"><Loader2 className="spin" /></div>;
  const newGuest = rows.find((d) => d.kind === "new_customer");
  const offers = rows.filter((d) => d.kind === "offer");

  return (
    <section>
      <header className="adm-head">
        <div><h1>Discounts</h1><p className="adm-muted">What guests see on the booking card. Discounts come off the nightly price, not the cleaning fee.</p></div>
        <button type="button" className="adm-btn primary" onClick={() => setEditing("new")}><Plus size={16} /> New offer</button>
      </header>

      <NewGuest current={newGuest} onSaved={load} />

      <h2 className="adm-sub">Offers</h2>
      <p className="adm-muted small" style={{ marginBottom: 12 }}>When more than one offer fits a stay, only the biggest is given. The new-guest discount is added on top.</p>
      {note && <p className={`adm-note ${note.tone}`}>{note.text}</p>}
      {offers.length === 0 ? <p className="adm-muted">No offers yet. Use New offer to add one, for example 10% off this weekend.</p> : (
        <ul className="adm-people">
          {offers.map((d) => {
            const s = status(d, today);
            return (
              <li key={d.id}>
                <span>
                  <strong>{d.percent}% off · {d.label}</strong>
                  <small>{d.starts_on || d.ends_on ? `${d.starts_on ? day(d.starts_on) : "Now"} to ${d.ends_on ? day(d.ends_on) : "no end date"}` : "No end date"} · {d.region ?? "Every area"}</small>
                </span>
                <span className="adm-row-end">
                  <span className="adm-badges"><em className={s.tone}>{s.text}</em></span>
                  <button type="button" className="adm-btn" onClick={() => setEditing(d)}><Pencil size={14} /> Edit</button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {editing && <OfferEditor offer={editing === "new" ? null : editing} regions={regions} onClose={() => setEditing(null)} onSaved={async (text) => { await load(); setNote({ tone: "ok", text }); }} />}
    </section>
  );
}

function NewGuest({ current, onSaved }: { current?: Discount; onSaved: () => Promise<void> }) {
  const [active, setActive] = useState(current?.active ?? false);
  const [percent, setPercent] = useState(String(current?.percent ?? 5));
  const [label, setLabel] = useState(current?.label ?? "New guest discount");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note>(null);

  async function save() {
    const pct = Number(percent);
    if (!(pct > 0 && pct <= 50)) { setNote({ tone: "error", text: "Choose a discount between 1% and 50%." }); return; }
    if (!label.trim()) { setNote({ tone: "error", text: "Add a name guests will see." }); return; }
    setBusy(true); setNote(null);
    const values = { kind: "new_customer", label: label.trim(), percent: pct, active, starts_on: null, ends_on: null, region: null, updated_at: new Date().toISOString() };
    const { error } = current
      ? await supabase.from("discounts").update(values).eq("id", current.id)
      : await supabase.from("discounts").insert(values);
    if (!error) { await refresh(); await onSaved(); }
    setBusy(false);
    setNote(error ? { tone: "error", text: `Not saved: ${error.message}` } : { tone: "ok", text: active ? "Saved. New guests see it within a minute." : "Saved. The new-guest discount is off." });
  }

  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <BadgePercent />
        <div>
          <strong>New guest discount</strong>
          <small>Given the first time an email address sends a booking request from the website. The team sees it in the request.</small>
        </div>
      </div>
      <div className="adm-switches">
        <label className="adm-switch"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /><span /> On</label>
        <label className="adm-inline">Discount <input type="number" min={1} max={50} value={percent} onChange={(e) => setPercent(e.target.value)} /> %</label>
        <label className="adm-inline grow">Name <input value={label} maxLength={80} onChange={(e) => setLabel(e.target.value)} /></label>
        <button type="button" className="adm-btn primary" disabled={busy} onClick={save}>{busy && <Loader2 size={16} className="spin" />} Save</button>
      </div>
      {note && <p className={`adm-note ${note.tone}`}>{note.text}</p>}
    </div>
  );
}

function OfferEditor({ offer, regions, onClose, onSaved }: { offer: Discount | null; regions: string[]; onClose: () => void; onSaved: (text: string) => Promise<void> }) {
  const today = ukToday();
  const [label, setLabel] = useState(offer?.label ?? "");
  const [percent, setPercent] = useState(String(offer?.percent ?? 10));
  const [when, setWhen] = useState<"today" | "dates" | "open">(!offer ? "today" : offer.starts_on || offer.ends_on ? "dates" : "open");
  const [startsOn, setStartsOn] = useState(offer?.starts_on ?? today);
  const [endsOn, setEndsOn] = useState(offer?.ends_on ?? today);
  const [region, setRegion] = useState(offer?.region ?? "");
  const [active, setActive] = useState(offer?.active ?? true);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save() {
    const pct = Number(percent);
    if (!label.trim()) { setNote({ tone: "error", text: "Add a name guests will see, for example Weekend offer." }); return; }
    if (!(pct > 0 && pct <= 50)) { setNote({ tone: "error", text: "Choose a discount between 1% and 50%." }); return; }
    const dates = when === "today" ? { starts_on: today, ends_on: today } : when === "dates" ? { starts_on: startsOn || null, ends_on: endsOn || null } : { starts_on: null, ends_on: null };
    if (dates.starts_on && dates.ends_on && dates.ends_on < dates.starts_on) { setNote({ tone: "error", text: "The end date is before the start date." }); return; }
    setBusy(true); setNote(null);
    const values = { kind: "offer", label: label.trim(), percent: pct, ...dates, region: region || null, active, updated_at: new Date().toISOString() };
    const { error } = offer ? await supabase.from("discounts").update(values).eq("id", offer.id) : await supabase.from("discounts").insert(values);
    if (error) { setBusy(false); setNote({ tone: "error", text: `Not saved: ${error.message}` }); return; }
    await refresh();
    await onSaved("Saved. The website shows it within a minute.");
    onClose();
  }

  async function remove() {
    if (!offer || !window.confirm("Delete this offer?")) return;
    setBusy(true);
    const { error } = await supabase.from("discounts").delete().eq("id", offer.id);
    if (error) { setBusy(false); setNote({ tone: "error", text: `Not deleted: ${error.message}` }); return; }
    await refresh();
    await onSaved("Offer deleted.");
    onClose();
  }

  return (
    <div className="adm-sheet-back" onClick={onClose}>
      <div className="adm-sheet narrow" role="dialog" aria-modal="true" aria-label={offer ? "Edit offer" : "New offer"} onClick={(e) => e.stopPropagation()}>
        <header>
          <div><strong>{offer ? "Edit offer" : "New offer"}</strong><small>Shown on the booking card of every home it covers</small></div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </header>
        <div className="adm-sheet-body">
          <div className="adm-switches"><label className="adm-switch"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /><span /> On</label></div>
          <label className="adm-field">Name guests see<input value={label} maxLength={80} placeholder="For example: Weekend offer" onChange={(e) => setLabel(e.target.value)} /></label>
          <label className="adm-field">Discount, %<input type="number" min={1} max={50} value={percent} onChange={(e) => setPercent(e.target.value)} /></label>
          <fieldset className="adm-field adm-choice">
            <legend>When</legend>
            <div className="adm-chips">
              {([["today", "Today only"], ["dates", "Between dates"], ["open", "Until I switch it off"]] as const).map(([id, text]) => (
                <button key={id} type="button" aria-pressed={when === id} onClick={() => setWhen(id)}>{text}</button>
              ))}
            </div>
          </fieldset>
          {when === "dates" && (
            <div className="adm-grid">
              <label className="adm-field">From<input type="date" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} /></label>
              <label className="adm-field">To<input type="date" value={endsOn} min={startsOn || undefined} onChange={(e) => setEndsOn(e.target.value)} /></label>
            </div>
          )}
          <label className="adm-field">Area
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Every area</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <p className="adm-muted small">The dates are when guests can get the offer, in UK time, not the dates of their stay.</p>
        </div>
        <footer>
          {note && <p className={`adm-note ${note.tone}`}>{note.text}</p>}
          <div className="adm-actions">
            {offer && <button type="button" className="adm-btn danger" disabled={busy} onClick={remove}><Trash2 size={14} /> Delete</button>}
            <button type="button" className="adm-btn primary" disabled={busy} onClick={save}>{busy && <Loader2 size={16} className="spin" />} Save</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
