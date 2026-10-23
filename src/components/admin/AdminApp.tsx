"use client";

import type { Session } from "@supabase/supabase-js";
import { Loader2, LogOut } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase-browser";
import { ActivityPanel } from "./ActivityPanel";
import { AdminsPanel } from "./AdminsPanel";
import { DiscountsPanel } from "./DiscountsPanel";
import { ListingsPanel } from "./ListingsPanel";

type Tab = "listings" | "discounts" | "admins" | "activity";
const TABS: { id: Tab; label: string }[] = [
  { id: "listings", label: "Listings" },
  { id: "discounts", label: "Discounts" },
  { id: "admins", label: "Admins" },
  { id: "activity", label: "Activity" },
];

// The dashboard: sign in, then manage the website. A person is let in only when the database says they are an admin; an invited
// person becomes one the first time they sign in with their confirmed email.
export function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [tab, setTab] = useState<Tab>("listings");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let live = true;
    supabase.rpc("claim_admin").then(({ data }) => { if (live) setIsAdmin(data === true); });
    return () => { live = false; };
  }, [session]);

  const signOut = async () => { await supabase.auth.signOut(); setIsAdmin(null); };

  if (session === undefined) return <div className="adm adm-center"><Loader2 className="spin" /></div>;
  if (recovering) return <AuthShell><NewPassword onDone={() => setRecovering(false)} /></AuthShell>;
  if (!session) return <AuthShell><SignIn /></AuthShell>;
  if (isAdmin === null) return <div className="adm adm-center"><Loader2 className="spin" /></div>;
  if (!isAdmin) {
    return (
      <AuthShell>
        <h1>No access yet</h1>
        <p className="adm-muted">{session.user.email} is not an admin of this website. Ask an admin to invite this email address, then sign in again.</p>
        <button className="adm-btn" onClick={signOut}>Sign out</button>
      </AuthShell>
    );
  }

  return (
    <div className="adm">
      <aside className="adm-side">
        <Image className="adm-logo" src="/brand/recharge-logo-cream.png" alt="Recharge" width={1886} height={359} />
        <nav>
          {TABS.map((t) => (
            <button key={t.id} type="button" aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="adm-me">
          <span>{session.user.email}</span>
          <button type="button" onClick={signOut}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>
      <main className="adm-main">
        {tab === "listings" && <ListingsPanel />}
        {tab === "discounts" && <DiscountsPanel />}
        {tab === "admins" && <AdminsPanel me={session.user.id} />}
        {tab === "activity" && <ActivityPanel />}
      </main>
    </div>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm adm-auth">
      <div className="adm-card">
        <Image className="adm-logo" src="/brand/recharge-logo-forest.png" alt="Recharge" width={1886} height={366} />
        {children}
      </div>
    </div>
  );
}

function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim().toLowerCase(), password = String(f.get("password") ?? "");
    setBusy(true); setNote(null);
    const back = `${window.location.origin}/admin`;
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setNote({ tone: "error", text: error.message === "Email not confirmed" ? "Confirm your email first: open the link we sent you." : "That email and password do not match." });
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: back } });
      setNote(error ? { tone: "error", text: error.message } : { tone: "ok", text: "Check your email and open the link to confirm your address. Then sign in here." });
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: back });
      setNote(error ? { tone: "error", text: error.message } : { tone: "ok", text: "If that address has an account, we have emailed a link to set a new password." });
    }
    setBusy(false);
  }

  return (
    <>
      <h1>{mode === "signin" ? "Sign in" : mode === "signup" ? "Create your account" : "Reset your password"}</h1>
      <p className="adm-muted">{mode === "signup" ? "Only for people an admin has invited. Use the email address the invitation was sent to." : "The Recharge website dashboard."}</p>
      <form className="adm-form" onSubmit={submit}>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        {mode !== "forgot" && <label>Password<input name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={mode === "signup" ? 10 : undefined} required /></label>}
        {note && <p className={`adm-note ${note.tone}`}>{note.text}</p>}
        <button className="adm-btn primary" disabled={busy}>{busy ? <Loader2 size={16} className="spin" /> : null}{mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}</button>
      </form>
      <div className="adm-links">
        {mode !== "signin" && <button type="button" onClick={() => { setMode("signin"); setNote(null); }}>Back to sign in</button>}
        {mode === "signin" && <button type="button" onClick={() => { setMode("signup"); setNote(null); }}>Invited? Create your account</button>}
        {mode === "signin" && <button type="button" onClick={() => { setMode("forgot"); setNote(null); }}>Forgot password</button>}
      </div>
    </>
  );
}

function NewPassword({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError("");
    const { error } = await supabase.auth.updateUser({ password: String(new FormData(e.currentTarget).get("password") ?? "") });
    setBusy(false);
    if (error) setError(error.message); else onDone();
  }
  return (
    <>
      <h1>Choose a new password</h1>
      <form className="adm-form" onSubmit={submit}>
        <label>New password<input name="password" type="password" autoComplete="new-password" minLength={10} required /></label>
        {error && <p className="adm-note error">{error}</p>}
        <button className="adm-btn primary" disabled={busy}>Save password</button>
      </form>
    </>
  );
}
