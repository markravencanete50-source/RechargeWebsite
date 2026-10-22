"use client";

import { Loader2, Mail, Trash2, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase-browser";

type Admin = { user_id: string; email: string; created_at: string };
type Invite = { email: string; invited_at: string };
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Who can use the dashboard. An admin invites an email address; that person creates an account with it, confirms the email,
// and is an admin from their first sign-in. One login per person, so the activity log always says who did what.
export function AdminsPanel({ me }: { me: string }) {
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [note, setNote] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [a, i] = await Promise.all([
      supabase.from("admins").select("user_id,email,created_at").order("created_at"),
      supabase.from("admin_invites").select("email,invited_at").is("claimed_at", null).order("invited_at", { ascending: false }),
    ]);
    setAdmins(a.data ?? []); setInvites(i.data ?? []);
  }, []);
  useEffect(() => { queueMicrotask(load); }, [load]);

  async function invite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim().toLowerCase();
    setBusy(true); setNote(null);
    const { data: who } = await supabase.auth.getUser();
    const { error } = await supabase.from("admin_invites").upsert({ email, invited_by: who.user?.id, claimed_at: null });
    setBusy(false);
    if (error) { setNote({ tone: "error", text: error.message }); return; }
    form.reset();
    setNote({ tone: "ok", text: `Invited ${email}. Ask them to open ${window.location.origin}/admin, choose "Invited? Create your account" and use this email address.` });
    load();
  }

  async function remove(a: Admin) {
    if (!window.confirm(`Remove ${a.email}? They will no longer be able to use the dashboard.`)) return;
    const { error } = await supabase.from("admins").delete().eq("user_id", a.user_id);
    if (error) setNote({ tone: "error", text: error.message }); else load();
  }

  if (!admins) return <div className="adm-center"><Loader2 className="spin" /></div>;
  return (
    <section>
      <header className="adm-head"><div><h1>Admins</h1><p className="adm-muted">Everyone who can change the website. Give each person their own login.</p></div></header>
      <form className="adm-invite" onSubmit={invite}>
        <label className="adm-search"><Mail size={16} /><input name="email" type="email" placeholder="Email address to invite" required /></label>
        <button className="adm-btn primary" disabled={busy}><UserPlus size={16} /> Invite</button>
      </form>
      {note && <p className={`adm-note ${note.tone}`}>{note.text}</p>}
      <ul className="adm-people">
        {admins.map((a) => (
          <li key={a.user_id}>
            <span><strong>{a.email}</strong><small>Admin since {day(a.created_at)}{a.user_id === me ? " · you" : ""}</small></span>
            {a.user_id !== me && <button type="button" className="adm-btn" onClick={() => remove(a)}><Trash2 size={14} /> Remove</button>}
          </li>
        ))}
        {invites.map((i) => (
          <li key={i.email} className="pending">
            <span><strong>{i.email}</strong><small>Invited {day(i.invited_at)}, not signed in yet</small></span>
          </li>
        ))}
      </ul>
    </section>
  );
}
