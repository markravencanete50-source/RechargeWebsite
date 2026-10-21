"use client";

import { Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Faq } from "@/content/faqs";

type Group = { id: string; t: string; lead: string; items: Faq[] };

// Every question, grouped by topic, with a search box and a sidebar that follows your place on the page.
export function FaqExplorer({ groups, phone }: { groups: Group[]; phone: { display: string; href: string } }) {
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState(groups[0].id);
  const term = q.trim().toLowerCase();
  const shown = useMemo(
    () => groups.map((g) => ({ ...g, items: term ? g.items.filter((f) => (f.q + " " + f.a).toLowerCase().includes(term)) : g.items })).filter((g) => g.items.length),
    [groups, term],
  );
  const total = shown.reduce((n, g) => n + g.items.length, 0);

  useEffect(() => {
    const seen = new IntersectionObserver((entries) => {
      const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) setCurrent(top.target.id);
    }, { rootMargin: "-20% 0px -60% 0px" });
    groups.forEach((g) => { const el = document.getElementById(g.id); if (el) seen.observe(el); });
    return () => seen.disconnect();
  }, [groups, term]);

  return (
    <div className="faq-explorer">
      <aside className="faq-side">
        <label className="faq-search">
          <Search size={18} />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" aria-label="Search questions" />
          {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search"><X size={16} /></button>}
        </label>
        <nav aria-label="Topics">
          {groups.map((g) => {
            const n = shown.find((s) => s.id === g.id)?.items.length ?? 0;
            return (
              <a key={g.id} href={`#${g.id}`} className={current === g.id ? "on" : undefined} aria-disabled={!n}>
                {g.t}<span>{n}</span>
              </a>
            );
          })}
        </nav>
        <div className="faq-side-call">
          <strong>Still stuck?</strong>
          <a href={phone.href}>Call {phone.display}</a>
          <span>Any hour, any day.</span>
        </div>
      </aside>
      <div className="faq-groups">
        {term && <p className="faq-count">{total} {total === 1 ? "answer" : "answers"} for &ldquo;{q.trim()}&rdquo;</p>}
        {shown.length === 0 && <p className="faq-empty">No questions match. Try another word, or call us on <a href={phone.href}>{phone.display}</a>.</p>}
        {shown.map((g) => (
          <section key={g.id} id={g.id} className="faq-group">
            <h2 className="h3">{g.t}</h2>
            <p className="faq-group-lead">{g.lead}</p>
            <div className="faq">
              {g.items.map((f) => (
                <details key={f.q} open={!!term}>
                  <summary>{f.q}<span className="plus"><Plus size={18} /></span></summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
