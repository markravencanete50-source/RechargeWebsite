"use client";

import { ArrowLeft, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { adminFetch, supabase } from "@/lib/supabase-browser";
import { AmenityPicker } from "./AmenityPicker";

type Photo = { src: string; alt: string };
export type WebsiteData = {
  title?: string; region?: string; town?: string; district?: string; description?: string; houseRules?: string;
  guests?: number; bedrooms?: number; beds?: number; bathrooms?: number; price?: number; checkIn?: string; checkOut?: string;
  licence?: string; amenities?: string[]; photos?: Photo[];
};
export type WebsiteRow = { id: string; slug: string; published: boolean; featured_rank: number | null; data: WebsiteData };

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
const num = (v: string) => (v.trim() === "" ? undefined : Number(v));
const TYPES = ["image/jpeg", "image/png", "image/webp"];

// A listing made in the dashboard, not in Hostaway: every fact the property page shows, and its photos, which upload to the
// website's own photo store. It has no Hostaway calendar, so guests send a booking request and the team confirms the price.
export function WebsiteListingEditor({ row, vocabulary, regions, towns, takenSlugs, onClose, onSaved }: {
  row: WebsiteRow | null; vocabulary: string[]; regions: string[]; towns: { name: string; region: string }[]; takenSlugs: Set<string>;
  onClose: () => void; onSaved: () => Promise<void>;
}) {
  const d = row?.data ?? {};
  const [id, setId] = useState(row?.id ?? null);
  const [published, setPublished] = useState(row?.published ?? false);
  const [featured, setFeatured] = useState(!!row?.featured_rank);
  const [rank, setRank] = useState(String(row?.featured_rank ?? 1));
  const [title, setTitle] = useState(d.title ?? "");
  const [region, setRegion] = useState(d.region ?? "");
  const [town, setTown] = useState(d.town ?? "");
  const [district, setDistrict] = useState(d.district ?? "");
  const [facts, setFacts] = useState({
    bedrooms: String(d.bedrooms ?? 1), beds: String(d.beds ?? ""), bathrooms: String(d.bathrooms ?? ""), guests: String(d.guests ?? ""),
    price: String(d.price ?? ""), checkIn: d.checkIn ?? "15:00", checkOut: d.checkOut ?? "11:00", licence: d.licence ?? "",
  });
  const [description, setDescription] = useState(d.description ?? "");
  const [houseRules, setHouseRules] = useState(d.houseRules ?? "");
  const [amenities, setAmenities] = useState<string[]>(d.amenities ?? []);
  const [photos, setPhotos] = useState<Photo[]>(d.photos ?? []);
  const [uploading, setUploading] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  // The web address is made from the home itself, like the Hostaway homes ("2-bedroom-home-in-glasgow"), with a number added
  // when another home has it. Once saved it never changes, so links to the listing keep working.
  const [savedSlug, setSavedSlug] = useState(row?.slug ?? null);
  const finalSlug = useMemo(() => {
    if (savedSlug) return savedSlug;
    const beds = Number(facts.bedrooms);
    const base = slugify(`${beds > 0 ? `${beds}-bedroom` : "studio"}-home-in-${town}`);
    if (!takenSlugs.has(base)) return base;
    for (let n = 2; ; n++) if (!takenSlugs.has(`${base}-${n}`)) return `${base}-${n}`;
  }, [savedSlug, facts.bedrooms, town, takenSlugs]);
  const townOptions = towns.filter((t) => !region || t.region === region);
  const set = (k: keyof typeof facts) => (e: React.ChangeEvent<HTMLInputElement>) => setFacts((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function upload(files: FileList | null) {
    const list = [...(files ?? [])];
    setResult(null);
    for (const file of list) {
      if (!TYPES.includes(file.type)) { setResult({ tone: "error", text: `${file.name} is not a JPEG, PNG or WebP photo.` }); continue; }
      if (file.size > 10 * 1024 * 1024) { setResult({ tone: "error", text: `${file.name} is over 10 MB.` }); continue; }
      setUploading((n) => n + 1);
      const path = `${crypto.randomUUID()}.${file.type.split("/")[1].replace("jpeg", "jpg")}`;
      const { error } = await supabase.storage.from("listing-photos").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      setUploading((n) => n - 1);
      if (error) { setResult({ tone: "error", text: `${file.name} did not upload: ${error.message}` }); continue; }
      const src = supabase.storage.from("listing-photos").getPublicUrl(path).data.publicUrl;
      setPhotos((p) => [...p, { src, alt: "" }]);
    }
  }

  function check(): string | null {
    if (!title.trim()) return "Add a title.";
    if (!region.trim() || !town.trim()) return "Add the area and the town.";
    if (!(Number(facts.bedrooms) >= 0)) return "Add the number of bedrooms (0 for a studio).";
    if (featured && !(Number(rank) >= 1 && Number(rank) <= 100)) return "Featured position must be 1 to 100.";
    if (published && photos.length === 0) return "Add at least one photo before showing the listing on the website.";
    return null;
  }

  async function save() {
    const problem = check();
    if (problem) { setResult({ tone: "error", text: problem }); return; }
    setBusy(true); setResult(null);
    const data: WebsiteData = {
      title: title.trim(), region: region.trim(), town: town.trim(), district: district.trim() || undefined,
      description: description.trim() || undefined, houseRules: houseRules.trim() || undefined,
      bedrooms: Number(facts.bedrooms), beds: num(facts.beds), bathrooms: num(facts.bathrooms), guests: num(facts.guests), price: num(facts.price),
      checkIn: facts.checkIn.trim() || undefined, checkOut: facts.checkOut.trim() || undefined, licence: facts.licence.trim() || undefined,
      amenities, photos: photos.map((p) => ({ src: p.src, alt: p.alt.trim() || `${title.trim()}, photo` })),
    };
    const values = { slug: finalSlug, published, featured_rank: featured ? Math.round(Number(rank)) : null, data, updated_at: new Date().toISOString() };
    const { data: saved, error } = id
      ? await supabase.from("website_listings").update(values).eq("id", id).select("id").single()
      : await supabase.from("website_listings").insert(values).select("id").single();
    if (error) {
      setBusy(false);
      setResult({ tone: "error", text: error.code === "23505" ? "Another listing already uses that web address." : `Not saved: ${error.message}` });
      return;
    }
    setId(saved.id);
    setSavedSlug(values.slug);
    await adminFetch("/api/admin/refresh", { method: "POST" });
    await onSaved();
    setBusy(false);
    setResult({ tone: "ok", text: published ? "Saved. The website shows it within a minute." : "Saved as a draft. Turn on \"Show on the website\" when it is ready." });
  }

  async function remove() {
    if (!id || !window.confirm("Delete this listing from the website? This cannot be undone.")) return;
    setBusy(true);
    const { error } = await supabase.from("website_listings").delete().eq("id", id);
    if (error) { setBusy(false); setResult({ tone: "error", text: `Not deleted: ${error.message}` }); return; }
    await adminFetch("/api/admin/refresh", { method: "POST" });
    await onSaved();
    onClose();
  }

  return (
    <div className="adm-sheet-back" onClick={onClose}>
      <div className="adm-sheet" role="dialog" aria-modal="true" aria-label={row ? `Edit ${d.title}` : "New listing"} onClick={(e) => e.stopPropagation()}>
        <header>
          <div><strong>{row ? d.title : "New listing"}</strong><small>Website only, not in Hostaway{row?.published ? <> · <a href={`/properties/${row.slug}`} target="_blank" rel="noopener">View on the website</a></> : null}</small></div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </header>
        <div className="adm-sheet-body">
          <div className="adm-switches">
            <label className="adm-switch"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /><span /> Show on the website</label>
            <label className="adm-switch"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /><span /> Featured</label>
            {featured && <label className="adm-inline">Position <input type="number" min={1} max={100} value={rank} onChange={(e) => setRank(e.target.value)} /></label>}
          </div>

          <label className="adm-field">Title<input value={title} maxLength={200} placeholder="For example: 2-bedroom flat in Glasgow city centre" onChange={(e) => setTitle(e.target.value)} /></label>
          <div className="adm-grid">
            <label className="adm-field">Area<input list="adm-regions" value={region} maxLength={80} onChange={(e) => setRegion(e.target.value)} /></label>
            <label className="adm-field">Town<input list="adm-towns" value={town} maxLength={80} onChange={(e) => setTown(e.target.value)} /></label>
            <label className="adm-field"><span>Neighbourhood <small>optional</small></span><input value={district} maxLength={80} onChange={(e) => setDistrict(e.target.value)} /></label>
            <label className="adm-field"><span>Licence number <small>optional</small></span><input value={facts.licence} maxLength={60} onChange={set("licence")} /></label>
          </div>
          <datalist id="adm-regions">{regions.map((r) => <option key={r} value={r} />)}</datalist>
          <datalist id="adm-towns">{townOptions.map((t) => <option key={t.name} value={t.name} />)}</datalist>

          <div className="adm-grid four">
            <label className="adm-field">Bedrooms<input type="number" min={0} max={30} value={facts.bedrooms} onChange={set("bedrooms")} /></label>
            <label className="adm-field">Beds<input type="number" min={0} max={60} value={facts.beds} onChange={set("beds")} /></label>
            <label className="adm-field">Bathrooms<input type="number" min={0} max={30} step={0.5} value={facts.bathrooms} onChange={set("bathrooms")} /></label>
            <label className="adm-field">Sleeps<input type="number" min={1} max={60} value={facts.guests} onChange={set("guests")} /></label>
            <label className="adm-field">Typical night £<input type="number" min={0} max={10000} value={facts.price} onChange={set("price")} /></label>
            <label className="adm-field">Check in from<input value={facts.checkIn} maxLength={20} onChange={set("checkIn")} /></label>
            <label className="adm-field">Check out by<input value={facts.checkOut} maxLength={20} onChange={set("checkOut")} /></label>
          </div>

          <div className="adm-field">
            <span>Photos <small>{photos.length ? "The first photo is the cover" : "JPEG, PNG or WebP, up to 10 MB each"}</small></span>
            <div className="adm-photos">
              {photos.map((p, i) => (
                <figure key={p.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- dashboard preview of an upload */}
                  <img src={p.src} alt="" />
                  <input aria-label={`Description of photo ${i + 1}`} placeholder="What it shows" value={p.alt} maxLength={160} onChange={(e) => setPhotos((l) => l.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} />
                  <div>
                    {i > 0 && <button type="button" onClick={() => setPhotos((l) => [l[i], ...l.filter((_, j) => j !== i)])}><ArrowLeft size={14} /> Cover</button>}
                    <button type="button" onClick={() => setPhotos((l) => l.filter((_, j) => j !== i))} aria-label={`Remove photo ${i + 1}`}><Trash2 size={14} /></button>
                  </div>
                </figure>
              ))}
              <label className="adm-upload">
                {uploading ? <Loader2 className="spin" /> : <ImagePlus />}
                <span>{uploading ? "Uploading" : "Add photos"}</span>
                <input type="file" accept={TYPES.join(",")} multiple onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
              </label>
            </div>
          </div>

          <label className="adm-field">Description<textarea rows={10} value={description} maxLength={20000} onChange={(e) => setDescription(e.target.value)} /></label>
          <label className="adm-field"><span>House rules <small>optional</small></span><textarea rows={4} value={houseRules} maxLength={5000} onChange={(e) => setHouseRules(e.target.value)} /></label>

          <div className="adm-field">
            <span>Amenities <small>{amenities.length} chosen</small></span>
            <AmenityPicker value={amenities} onChange={setAmenities} vocabulary={vocabulary} />
          </div>
        </div>
        <footer>
          <p className="adm-muted small">Guests cannot book this home instantly. They send a request, and the team confirms the dates and price.</p>
          {result && <p className={`adm-note ${result.tone}`}>{result.text}</p>}
          <div className="adm-actions">
            {id && <button type="button" className="adm-btn danger" disabled={busy} onClick={remove}><Trash2 size={14} /> Delete</button>}
            <button type="button" className="adm-btn primary" disabled={busy || uploading > 0} onClick={save}>{busy && <Loader2 size={16} className="spin" />} Save</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
