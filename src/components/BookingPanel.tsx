"use client";

import { ArrowUpRight, CalendarDays, Check, ChevronDown, Info, Loader2, MessageCircle, Minus, Plus, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { Quote } from "@/lib/hostaway";
import { RollingNumber } from "./RollingNumber";
import { TeamChat, useTeamChat } from "./TeamChat";

const ease = [0.2, 0.7, 0.2, 1] as const;
type HomeInfo = { slug: string; title: string; town: string; price?: number; currency?: string; maxGuests?: number; checkIn?: string; bookingUrl: string; longStay: boolean };
type Contact = { phone: { display: string; href: string }; email: string; discount: string };

const fmt = (n: number, c = "GBP") => new Intl.NumberFormat("en-GB", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);
const day = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
// Past dates can't be picked. Set on focus, so the server and browser render the same page.
const noPast = (e: React.FocusEvent<HTMLInputElement>) => { if (!e.currentTarget.min) e.currentTarget.min = new Date().toISOString().slice(0, 10); };
const plusDays = (iso: string, n: number) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "quote"; q: Quote }
  | { kind: "estimate"; nights: number }
  | { kind: "error"; message: string };

// The booking card on a property page: choose dates and guests and see the cost add up, night by
// night, with live prices and availability from Hostaway. Request to book or message the team
// from the same card; both open the chat with the stay attached. Payment is added later.
export function BookingPanel({ home, contact }: { home: HomeInfo; contact: Contact }) {
  const reduce = useReducedMotion();
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [showNights, setShowNights] = useState(false);
  const [chat, setChat] = useState<null | "book" | "ask">(null);
  const team = useTeamChat(home, chat !== null);
  const closeChat = useCallback(() => setChat(null), []);
  const nights = checkin && checkout ? Math.round((Date.parse(checkout) - Date.parse(checkin)) / 86_400_000) : 0;
  const maxGuests = home.maxGuests ?? 16;

  // Prices the stay whenever the dates settle.
  useEffect(() => {
    if (!checkin || !checkout || nights < 1) return;
    let live = true;
    const t = setTimeout(async () => {
      setState({ kind: "loading" });
      try {
        const res = await fetch(`/api/quote?home=${encodeURIComponent(home.slug)}&checkin=${checkin}&checkout=${checkout}`);
        if (!live) return;
        if (res.ok) { setState({ kind: "quote", q: await res.json() }); return; }
        // Without the live connection, an honest estimate from the typical nightly rate.
        if (res.status === 503 && home.price) { setState({ kind: "estimate", nights }); return; }
        setState({ kind: "error", message: "We could not price those dates just now. Message us and we will send you a price." });
      } catch {
        if (live) setState({ kind: "error", message: "We could not price those dates just now. Message us and we will send you a price." });
      }
    }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [checkin, checkout, nights, home.slug, home.price]);

  const q = state.kind === "quote" ? state.q : null;
  const tooShort = q && q.nights < q.minStay;
  const total = q ? q.total : state.kind === "estimate" && home.price ? home.price * state.nights : 0;
  const currency = q?.currency ?? home.currency ?? "GBP";
  const avg = q && q.nights ? Math.round(q.subtotal / q.nights) : home.price ?? 0;
  const bookable = !!q && q.available && !tooShort && guests <= (q.maxGuests ?? maxGuests);
  const stay = checkin && checkout && nights > 0 ? { checkin, checkout, guests, total: total || undefined, currency } : null;

  return (
    <>
      <div className="bp" id="book">
        <p className="book-price">{home.price !== undefined ? <>From around <strong>{fmt(home.price, home.currency)}</strong> a night</> : <strong>Book direct</strong>}</p>

        <div className="bp-dates">
          <label>
            <span>Check in</span>
            <input type="date" value={checkin} onFocus={noPast} onChange={(e) => { const v = e.target.value; setCheckin(v); if (v && (!checkout || checkout <= v)) setCheckout(plusDays(v, 2)); }} />
          </label>
          <label>
            <span>Check out</span>
            <input type="date" value={checkout} min={checkin ? plusDays(checkin, 1) : undefined} onFocus={noPast} onChange={(e) => setCheckout(e.target.value)} />
          </label>
          <div className="bp-guests">
            <span>Guests</span>
            <div>
              <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1}><Minus size={16} /></button>
              <motion.strong key={guests} initial={reduce ? false : { y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{guests}</motion.strong>
              <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))} disabled={guests >= maxGuests}><Plus size={16} /></button>
            </div>
          </div>
        </div>

        <div className="bp-sum" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {state.kind === "idle" && (
              <motion.p key="idle" className="bp-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><CalendarDays size={16} /> Choose your dates to see the full price.</motion.p>
            )}
            {state.kind === "loading" && (
              <motion.div key="loading" className="bp-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 size={16} className="spin" /> Checking prices and availability
                <span className="bp-ghost" /><span className="bp-ghost short" />
              </motion.div>
            )}
            {state.kind === "error" && (
              <motion.p key="error" className="bp-note warn" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Info size={16} /> {state.message}</motion.p>
            )}
            {(state.kind === "quote" || state.kind === "estimate") && (
              <motion.div key={`${checkin}-${checkout}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
                <ul className="bp-lines">
                  <motion.li initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
                    <button type="button" className="bp-expand" onClick={() => setShowNights((s) => !s)} disabled={!q} aria-expanded={showNights}>
                      {fmt(avg, currency)} × {q ? q.nights : nights} night{(q ? q.nights : nights) === 1 ? "" : "s"}
                      {q && <ChevronDown size={14} style={{ transform: showNights ? "rotate(180deg)" : undefined, transition: "transform 300ms" }} />}
                    </button>
                    <span>{fmt(q ? q.subtotal : total, currency)}</span>
                  </motion.li>
                  <AnimatePresence initial={false}>
                    {q && showNights && (
                      <motion.li className="bp-nights" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <ul>{q.nightly.map((n) => <li key={n.date}><span>{day(n.date)}</span><span>{fmt(n.price, currency)}</span></li>)}</ul>
                      </motion.li>
                    )}
                  </AnimatePresence>
                  {q && q.cleaningFee > 0 && (
                    <motion.li initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}><span>Cleaning fee</span><span>{fmt(q.cleaningFee, currency)}</span></motion.li>
                  )}
                  <motion.li className="bp-total" initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <span>{state.kind === "estimate" ? "Estimated total" : "Total"}</span>
                    <strong>{currency === "GBP" ? "£" : ""}<RollingNumber value={Math.round(total)} /></strong>
                  </motion.li>
                </ul>
                {state.kind === "estimate" && <p className="bp-note"><Info size={14} /> Estimate from a typical night, before the cleaning fee. We confirm the exact price with you.</p>}
                {q && !q.available && <p className="bp-note warn"><Info size={14} /> Already booked on {q.unavailable.slice(0, 3).map(day).join(", ")}{q.unavailable.length > 3 ? " and more" : ""}. Try other dates, or message us.</p>}
                {q && q.available && tooShort && <p className="bp-note warn"><Info size={14} /> The minimum stay for these dates is {q.minStay} nights.</p>}
                {q && guests > (q.maxGuests ?? maxGuests) && <p className="bp-note warn"><Info size={14} /> This home sleeps up to {q.maxGuests ?? maxGuests}.</p>}
                {bookable && <motion.p className="bp-note ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}><Check size={14} /> Available for your dates</motion.p>}
                {home.longStay && nights >= 28 && <p className="bp-note ok"><Sparkles size={14} /> Long-stay discount available on request. Ask us below.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button type="button" className="btn btn-primary bp-cta" whileTap={reduce ? undefined : { scale: 0.97 }} onClick={() => setChat("book")}>
          {stay ? "Request to book" : "Check dates and book"} <ArrowUpRight size={18} />
        </motion.button>
        <button type="button" className="btn btn-ghost bp-ask" onClick={() => setChat("ask")}>
          <MessageCircle size={18} /> {team.session ? "Open your chat" : "Message the team"}
          <AnimatePresence>{team.unread > 0 && <motion.em className="bp-unread" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} aria-label={`${team.unread} new ${team.unread === 1 ? "reply" : "replies"}`}>{team.unread}</motion.em>}</AnimatePresence>
        </button>
        <p className="bp-small">You will not be charged yet. Book direct and save {contact.discount}. <a href={home.bookingUrl} target="_blank" rel="noopener">Or book on our booking site</a>.</p>
      </div>

      <AnimatePresence>
        {chat && <TeamChat home={home} contact={contact} chat={team} stay={stay} onClose={closeChat}
          intro={chat === "book" && !stay ? `Hi! Tell us your dates and how many are coming, and we will check ${home.title} for you.` : `Hi! This is the Recharge team. Ask us anything about ${home.title}. We reply 24/7.`}
          draft={chat === "book" && stay ? `Hi, I would like to book ${home.title} from ${day(stay.checkin)} to ${day(stay.checkout)} for ${stay.guests} guest${stay.guests === 1 ? "" : "s"}.` : ""} />}
      </AnimatePresence>
    </>
  );
}
