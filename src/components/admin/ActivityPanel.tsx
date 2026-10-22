"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Entry = { id: number; at: string; email: string | null; action: string; target: string };
const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const WHAT: Record<string, string> = { insert: "added", update: "changed", delete: "removed", invite: "invited", joined: "joined as admin" };
const THING: Record<string, string> = { listing_overrides: "listing", website_listings: "website listing", settings: "settings", discounts: "discount", admin_invites: "", admins: "" };

// Every change made through the dashboard, newest first. Written by the database, so nothing can change without an entry.
export function ActivityPanel() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  useEffect(() => {
    supabase.from("audit_log").select("id,at,email,action,target").order("at", { ascending: false }).limit(150).then(({ data }) => setEntries(data ?? []));
  }, []);
  if (!entries) return <div className="adm-center"><Loader2 className="spin" /></div>;
  return (
    <section>
      <header className="adm-head"><div><h1>Activity</h1><p className="adm-muted">The last 150 changes, newest first.</p></div></header>
      {entries.length === 0 ? <p className="adm-muted">Nothing has been changed yet.</p> : (
        <ul className="adm-log">
          {entries.map((e) => {
            const [table, id] = e.target.split(":");
            return (
              <li key={e.id}>
                <time>{when(e.at)}</time>
                <span><strong>{e.email ?? "Set up"}</strong> {WHAT[e.action] ?? e.action} {THING[table] ?? table} {id}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
