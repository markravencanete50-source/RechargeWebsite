"use client";

import { ArrowRight, Check, ChevronDown, Clock, FileText } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { MANAGEMENT_FEES, PLATFORM_FEE } from "@/content/estimate-sums";

// An example of the monthly owner statement from the Recharge app, with made-up figures that add up. The fees are the same as in
// the earnings calculator. Every line opens to show where the money came from: the booking, the platform's payout, the match with
// the bank, and only then the statement. A stay whose payout has not arrived waits for next month's statement.
const FEE = MANAGEMENT_FEES[1];
const CLEAN = 45;
type Stay = { id: string; dates: string; nights: number; channel: "Airbnb" | "Booking.com" | "Direct"; income: number; paid?: string; due?: string };
const STAYS: Stay[] = [
  { id: "s1", dates: "2 to 5 Oct", nights: 3, channel: "Airbnb", income: 354, paid: "6 Oct" },
  { id: "s2", dates: "6 to 11 Oct", nights: 5, channel: "Booking.com", income: 520, paid: "14 Oct" },
  { id: "s3", dates: "12 to 16 Oct", nights: 4, channel: "Direct", income: 440, paid: "12 Oct" },
  { id: "s4", dates: "18 to 25 Oct", nights: 7, channel: "Airbnb", income: 672, paid: "19 Oct" },
  { id: "s5", dates: "26 to 30 Oct", nights: 4, channel: "Booking.com", income: 500, due: "15 Nov" },
];
const REPAIR = { id: "r1", text: "New bathroom extractor fan", amount: 145, quoted: "8 Oct", approved: "9 Oct", done: "11 Oct" };
const SUPPLIES = 24;

const gbp = (n: number) => `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const platformFee = (s: Stay) => (s.channel === "Direct" ? 0 : Math.round(s.income * PLATFORM_FEE) / 100);
const cleared = STAYS.filter((s) => s.paid);
const income = cleared.reduce((n, s) => n + s.income, 0);
const platform = cleared.reduce((n, s) => n + platformFee(s), 0);
const management = Math.round(income * FEE) / 100;
const cleaning = cleared.length * CLEAN;
const toYou = income - platform - management - cleaning - REPAIR.amount - SUPPLIES;
const waiting = STAYS.filter((s) => !s.paid);

export function SampleStatement() {
  const [open, setOpen] = useState<string | null>("s2");
  const reduce = useReducedMotion();
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id));

  const trail = (steps: { done: boolean; text: string }[]) => (
    <AnimatePresence initial={false}>
      <motion.ol className="st-trail" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
        {steps.map((s) => <li key={s.text} className={s.done ? "done" : "wait"}>{s.done ? <Check size={13} /> : <Clock size={13} />}{s.text}</li>)}
      </motion.ol>
    </AnimatePresence>
  );

  return (
    <div className="st">
      <div className="st-doc">
        <header className="st-head">
          <div>
            <span className="st-tag"><FileText size={14} /> Example statement</span>
            <strong>October</strong>
            <small>2-bedroom flat, Glasgow · full management at {FEE}%</small>
          </div>
          <div className="st-total-mini">
            <small>To you</small>
            <strong>{gbp(toYou)}</strong>
          </div>
        </header>

        <section>
          <h3>Stays paid out this month</h3>
          <ul className="st-lines">
            {cleared.map((s) => (
              <li key={s.id} className={open === s.id ? "open" : ""}>
                <button type="button" aria-expanded={open === s.id} onClick={() => toggle(s.id)}>
                  <span><strong>{s.dates}</strong><small>{s.nights} nights · {s.channel}</small></span>
                  <em>{gbp(s.income)}</em>
                  <ChevronDown size={16} />
                </button>
                {open === s.id && trail([
                  { done: true, text: `Booked through ${s.channel === "Direct" ? "the Recharge website" : s.channel}: ${gbp(s.income)}` },
                  s.channel === "Direct"
                    ? { done: true, text: `Paid by the guest on ${s.paid}, no platform fee` }
                    : { done: true, text: `${s.channel} kept its ${PLATFORM_FEE}% fee (${gbp(platformFee(s))}) and paid out ${gbp(s.income - platformFee(s))} on ${s.paid}` },
                  { done: true, text: "Matched to the money received in the bank" },
                  { done: true, text: "Cleared, so it is on this statement" },
                ])}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Costs</h3>
          <ul className="st-lines costs">
            <li><div><span><strong>Platform fees</strong><small>{PLATFORM_FEE}% on Airbnb and Booking.com stays, none on direct</small></span><em>−{gbp(platform)}</em></div></li>
            <li><div><span><strong>Recharge management</strong><small>{FEE}% of booking income</small></span><em>−{gbp(management)}</em></div></li>
            <li><div><span><strong>Cleaning and laundry</strong><small>{cleared.length} cleans, each finished with photo evidence</small></span><em>−{gbp(cleaning)}</em></div></li>
            <li className={open === REPAIR.id ? "open" : ""}>
              <button type="button" aria-expanded={open === REPAIR.id} onClick={() => toggle(REPAIR.id)}>
                <span><strong>Repair: {REPAIR.text.toLowerCase()}</strong><small>Over your £100 repair limit, so approved by you in the app</small></span>
                <em>−{gbp(REPAIR.amount)}</em>
                <ChevronDown size={16} />
              </button>
              {open === REPAIR.id && trail([
                { done: true, text: `Reported during a clean, quoted on ${REPAIR.quoted}` },
                { done: true, text: `Over your repair limit, so you approved the quote in the app on ${REPAIR.approved}` },
                { done: true, text: `Fitted on ${REPAIR.done}, with photos of the finished work` },
              ])}
            </li>
            <li><div><span><strong>Guest supplies</strong><small>Toilet roll, soap, tea and coffee</small></span><em>−{gbp(SUPPLIES)}</em></div></li>
          </ul>
        </section>

        <div className="st-total">
          <span><strong>To you</strong><small>Paid on 5 November, from cleared funds</small></span>
          <strong>{gbp(toYou)}</strong>
        </div>

        {waiting.map((s) => (
          <button key={s.id} type="button" className={`st-carry${open === s.id ? " open" : ""}`} aria-expanded={open === s.id} onClick={() => toggle(s.id)}>
            <span><Clock size={15} /> <strong>Waiting for next month: {s.dates}, {s.channel}, {gbp(s.income)}</strong></span>
            <small>The stay is finished, but {s.channel} pays out on {s.due}. It goes on your November statement once the money has cleared, never before.</small>
          </button>
        ))}
      </div>

      <div className="st-side">
        <p className="eyebrow">Why it works this way</p>
        <ul className="checks single">
          <li><Check size={18} /> You are paid from money that has arrived, not from bookings that might be cancelled or paid late.</li>
          <li><Check size={18} /> Every booking is matched to the platform payout and the bank before it reaches your statement.</li>
          <li><Check size={18} /> Repairs under the limit you set go ahead, and you see them here. Anything over it, and all furnishing, waits for your approval in the app.</li>
          <li><Check size={18} /> Your statement is in your client portal, line by line, every month.</li>
        </ul>
        <a className="btn btn-primary" href="/owners#estimate">Get your free estimate <ArrowRight size={18} /></a>
        <p className="fine">An example with made-up figures. Your statement shows your own bookings, fees and costs.</p>
      </div>
    </div>
  );
}
