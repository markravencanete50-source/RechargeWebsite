"use client";

import { ArrowRight, Check, ClipboardCopy, Download, Minus, Plus, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_LAYOUT, INPUTS, calculateFurnishing, clampInput, furnishingCsv, furnishingText, type Count, type Layout } from "@/content/furnishing";

const GROUPS = [
  { id: "rooms", title: "Rooms" },
  { id: "sleeping", title: "Beds and bedrooms" },
] as const;

// The furnishing calculator: an owner sets the rooms and beds, and sees everything a guest-ready home needs, by room, with the
// rule behind every number. The list can be copied, saved as a spreadsheet or printed, and Recharge can quote to supply it.
export function FurnishingCalculator() {
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);
  const [copied, setCopied] = useState(false);
  // Every area open on a wide screen; on a phone only the first, so the list is not one very long page.
  const [wide, setWide] = useState(false);
  useEffect(() => { queueMicrotask(() => setWide(window.matchMedia("(min-width: 900px)").matches)); }, []);
  const list = useMemo(() => calculateFurnishing(layout), [layout]);
  const set = (key: Count, value: number) => setLayout((l) => ({ ...l, [key]: clampInput(key, value) }));

  async function copy() {
    try {
      await navigator.clipboard.writeText(furnishingText(layout, list));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }
  function download() {
    const url = URL.createObjectURL(new Blob([furnishingCsv(layout, list)], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "recharge-furnishing-list.csv" });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="furn">
      <div className="furn-inputs">
        {GROUPS.map((g) => (
          <fieldset key={g.id} className="furn-group">
            <legend>{g.title}</legend>
            {INPUTS.filter((i) => i.group === g.id).map((i) => (
              <div key={i.key} className="furn-row">
                <span><strong>{i.label}</strong><small>{i.help}</small></span>
                <div className="furn-step">
                  <button type="button" aria-label={`Fewer ${i.label.toLowerCase()}`} disabled={layout[i.key] <= i.min} onClick={() => set(i.key, layout[i.key] - 1)}><Minus size={16} /></button>
                  <input type="number" inputMode="numeric" aria-label={i.label} min={i.min} max={i.max} value={layout[i.key]} onChange={(e) => set(i.key, Number(e.target.value))} />
                  <button type="button" aria-label={`More ${i.label.toLowerCase()}`} disabled={layout[i.key] >= i.max} onClick={() => set(i.key, layout[i.key] + 1)}><Plus size={16} /></button>
                </div>
              </div>
            ))}
          </fieldset>
        ))}
      </div>

      <div className="furn-result">
        <div className="furn-total" aria-live="polite">
          <div><strong>{list.total}</strong><span>items to buy</span></div>
          <div><strong>{list.beds}</strong><span>{list.beds === 1 ? "bed" : "beds"}, sofa beds included</span></div>
          <div><strong>{list.categories.length}</strong><span>areas of the home</span></div>
        </div>
        <div className="furn-actions">
          <button type="button" className="btn btn-ghost" onClick={copy}>{copied ? <Check size={16} /> : <ClipboardCopy size={16} />} {copied ? "Copied" : "Copy the list"}</button>
          <button type="button" className="btn btn-ghost" onClick={download}><Download size={16} /> Spreadsheet</button>
          <button type="button" className="btn btn-ghost" onClick={() => window.print()}><Printer size={16} /> Print</button>
        </div>

        <div className="furn-cats">
          {list.categories.map((c, i) => (
            <details key={`${c.id}-${wide}`} className="furn-cat" open={wide || i === 0}>
              <summary><span>{c.title}</span><em>{c.lines.reduce((n, l) => n + l.quantity, 0)}</em></summary>
              <ul>
                {c.lines.map((l) => (
                  <li key={l.item}>
                    <b>{l.quantity}</b>
                    <span>{l.item}<small>{l.rule}</small></span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="calc-cta furn-cta">
          <div>
            <strong>Want us to furnish it for you?</strong>
            <span>Our Recharge Ready team quotes every item on this list. You accept or reject the quote in the Recharge app, and we set the home up ready for its first guest.</span>
          </div>
          <a className="btn btn-mint" href="/owners#estimate">Ask for a furnishing quote <ArrowRight size={18} /></a>
        </div>
      </div>
    </div>
  );
}
