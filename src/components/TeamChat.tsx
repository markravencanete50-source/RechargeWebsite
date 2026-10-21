"use client";

import { AlertTriangle, Loader2, Mail, Phone, Send, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

export type ChatHome = { slug: string; title: string };
export type ChatContact = { phone: { display: string; href: string }; email: string };
export type ChatStay = { checkin: string; checkout: string; guests: number; total?: number; currency: string } | null;
type Guest = { name: string; email: string; phone: string };
type Session = { key: string; guest: Guest; booking: string | null };
type Message = { id: string; from: "guest" | "team"; body: string; sentAt: string; name?: string | null };

const fmt = (n: number, c = "GBP") => new Intl.NumberFormat("en-GB", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);
const day = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const clock = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const OPEN_POLL = 4000;
const CLOSED_POLL = 15000;

// A random chat key, made in this browser. The team's app keeps only a hash of it, so only this tab can read the chat.
function newKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// The chat for one home, kept for as long as this browser tab is open: sessionStorage is cleared when the tab closes, and that
// ends the chat for the guest (the team keeps it in their inbox). Polls for the team's replies, quickly while the window is open
// and slowly while it is closed, so a reply can be flagged on the button.
export function useTeamChat(home: ChatHome, open: boolean) {
  const store = `recharge-chat:${home.slug}`;
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [seen, setSeen] = useState(0);

  // Picks up a chat started earlier in this tab, after a reload. Read once, after the page has mounted.
  useEffect(() => {
    let saved: Session | null = null;
    try { saved = JSON.parse(sessionStorage.getItem(store) || "null"); } catch {}
    if (saved?.key) queueMicrotask(() => setSession(saved));
  }, [store]);

  const save = useCallback((s: Session) => {
    setSession(s);
    try { sessionStorage.setItem(store, JSON.stringify(s)); } catch {}
  }, [store]);

  const refresh = useCallback(async (key: string) => {
    try {
      const res = await fetch("/api/guest-chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat: key }), cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { messages?: Message[] };
      if (Array.isArray(data.messages)) setMessages(data.messages);
    } catch {}
  }, []);

  useEffect(() => {
    if (!session) return;
    let live = true;
    const tick = () => { if (live && document.visibilityState === "visible") void refresh(session.key); };
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, open ? OPEN_POLL : CLOSED_POLL);
    document.addEventListener("visibilitychange", tick);
    return () => { live = false; clearTimeout(first); clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, [session, open, refresh]);

  const teamCount = messages.filter((m) => m.from === "team").length;
  // Everything the team has said counts as read while the window is open.
  useEffect(() => { if (open && teamCount > seen) queueMicrotask(() => setSeen(teamCount)); }, [open, teamCount, seen]);

  // Leaving the page ends the chat, so the browser asks first once a conversation has started.
  useEffect(() => {
    if (!session) return;
    // Browsers show their own wording; some only ask when a message is set.
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = "Leaving this page removes your chat with the team."; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [session]);

  return { session, save, messages, refresh, unread: open ? 0 : Math.max(0, teamCount - seen) };
}
export type TeamChatState = ReturnType<typeof useTeamChat>;

// The chat window with the Recharge team. The first message asks for a name and email; after that it is a plain chat. Messages go
// to the team's Guest inbox in the Recharge app, and their replies appear here.
export function TeamChat({ home, contact, chat, intro, draft, stay, onClose }: { home: ChatHome; contact: ChatContact; chat: TeamChatState; intro: string; draft: string; stay: ChatStay; onClose: () => void }) {
  const reduce = useReducedMotion();
  const { session, save, messages, refresh } = chat;
  const [sending, setSending] = useState<string | null>(null);
  const [failed, setFailed] = useState<{ text: string; mailto: string } | null>(null);
  const [text, setText] = useState(draft);
  const end = useRef<HTMLDivElement>(null);
  const bookingNow = useMemo(() => (stay ? JSON.stringify(stay) : null), [stay]);
  const waiting = !!session && !sending && messages.length > 0 && messages.at(-1)?.from === "guest";

  useEffect(() => { end.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" }); }, [messages.length, sending, failed, reduce]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const body = text.trim();
    if (!body || sending) return;
    const guest: Guest = session?.guest ?? { name: (f.name || "").trim(), email: (f.email || "").trim(), phone: (f.phone || "").trim() };
    const key = session?.key ?? newKey();
    // The stay goes with the first message, and again only if the guest has changed the dates since.
    const booking = bookingNow && bookingNow !== session?.booking ? stay : null;
    setSending(body);
    setFailed(null);
    let ok = false;
    try {
      const res = await fetch("/api/guest-message", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...guest, message: body, website: f.website, home: home.slug, booking, chat: key }) });
      ok = res.ok;
    } catch {}
    if (ok) {
      save({ key, guest, booking: booking ? bookingNow : session?.booking ?? null });
      setText("");
      await refresh(key);
    } else {
      const subject = encodeURIComponent(`${home.title}${stay ? `, ${stay.checkin} to ${stay.checkout}` : ""}`);
      const mail = encodeURIComponent(`${body}\n\n${stay ? `Dates: ${stay.checkin} to ${stay.checkout}\nGuests: ${stay.guests}\n` : ""}Name: ${guest.name}\nPhone: ${guest.phone || "-"}`);
      setFailed({ text: body, mailto: `mailto:${contact.email}?subject=${subject}&body=${mail}` });
    }
    setSending(null);
  }

  const bubble = (key: string, from: "team" | "you", content: string, extra?: { tone?: string; meta?: string }) => (
    <motion.div key={key} className={`bubble-wrap ${from}`} initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 26 }}>
      <p className={`bubble ${from}${extra?.tone ? ` ${extra.tone}` : ""}`}>{content}</p>
      {extra?.meta && <span className="bubble-meta">{extra.meta}</span>}
    </motion.div>
  );

  return createPortal(
    <motion.div className="chat-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="chat"
        role="dialog"
        aria-modal="true"
        aria-label="Message the Recharge team"
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? false : { x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={reduce ? undefined : { x: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <header className="chat-head">
          <span className="chat-avatar">R<i /></span>
          <div><strong>Recharge team</strong><span>Replies here, 24/7</span></div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </header>
        <p className="chat-keep" role="note">
          <AlertTriangle size={16} aria-hidden />
          <span>Keep this page open while you chat. The team replies right here. If you close or leave this page, this conversation is removed.</span>
        </p>
        <div className="chat-body" aria-live="polite">
          {stay && (
            <motion.div className="chat-stay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <strong>{home.title}</strong>
              <span>{day(stay.checkin)} to {day(stay.checkout)} · {stay.guests} guest{stay.guests === 1 ? "" : "s"}{stay.total ? ` · ${fmt(stay.total, stay.currency)}` : ""}</span>
            </motion.div>
          )}
          {bubble("intro", "team", intro)}
          {messages.map((m) => bubble(m.id, m.from === "guest" ? "you" : "team", m.body, { meta: `${m.from === "team" ? `${m.name || "Recharge team"} · ` : ""}${clock(m.sentAt)}` }))}
          {sending && bubble("sending", "you", sending, { meta: "Sending…" })}
          <AnimatePresence>
            {waiting && (
              <motion.p key="waiting" className="chat-waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="typing-dots" aria-hidden><i /><i /><i /></span> Sent to the team. Their reply will appear here, usually within a few minutes.
              </motion.p>
            )}
          </AnimatePresence>
          {failed && bubble("failed", "team", `We could not send this from here just now. Email it to ${contact.email} (we have filled it in for you) or call ${contact.phone.display}, any hour.`, { tone: "warn" })}
          {failed && <a className="btn btn-primary chat-mail" href={failed.mailto}><Mail size={16} /> Email the team</a>}
          {failed && <a className="btn btn-ghost chat-mail" href={contact.phone.href}><Phone size={16} /> {contact.phone.display}</a>}
          <div ref={end} />
        </div>
        <form className="chat-form" onSubmit={send}>
          {!session && (
            <>
              <div className="chat-row">
                <input name="name" placeholder="Your name" autoComplete="name" required maxLength={120} />
                <input name="email" type="email" placeholder="Email" autoComplete="email" required maxLength={200} />
              </div>
              <input name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" maxLength={40} />
            </>
          )}
          <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
          <div className="chat-compose">
            <textarea
              name="message"
              required
              maxLength={4000}
              rows={session ? 2 : 3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && session) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
              placeholder={session ? "Write a message" : "Type your message"}
              aria-label="Your message"
            />
            <button type="submit" disabled={!!sending} aria-label="Send">{sending ? <Loader2 size={18} className="spin" /> : <Send size={18} />}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
