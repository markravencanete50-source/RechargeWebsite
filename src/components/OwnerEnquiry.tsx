"use client";

import { ArrowUpRight, Check, Mail, Phone, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { appSignUp, site } from "@/content/site";

// The same questions, in the same words, as the New Property Enquiry Form in the Recharge app
// (lib/client-enquiry.ts), so an enquiry from the website lands in the team's list like any other. The questions, the
// thank-you and the account prompt follow the business plan's Estimate Request step (lib/client-onboarding.ts in the app).
const PROPERTY_TYPES = ["Flat", "House", "Cottage", "Bungalow", "Studio", "Townhouse", "Lodge", "Other"];
const STAGES = [
  "I'd like a free performance estimate",
  "I'm ready to get started",
  "My property is already a short-term let and I want a new manager",
  "I'm thinking about switching from long-term letting",
  "I'm just exploring my options",
  "Something else",
];
const START_WHEN = ["As soon as possible", "Within a month", "In 1 to 3 months", "In 3 months or more", "Not sure yet"];
const HEARD_FROM = ["Google", "Social media", "Airbnb or Booking.com", "Referral from a friend or client", "Other"];
const ROOMS = Array.from({ length: 11 }, (_, i) => i);

export const ASKS = [
  "Your name and email, and a phone number if you like",
  "The property address and postcode",
  "Property type, bedrooms, WCs and bathrooms",
  "Photos or videos, or a link to them",
  "The stage you are at, and when you would like to start",
  "How you heard about us, and who referred you",
];
// The app's thank-you after an enquiry (ENQUIRY_THANKS and ENQUIRY_ACCOUNT_PROMPT in its lib/client-onboarding.ts).
const REPLY = "A member of the team will be in touch with your estimate by email, usually within 48 hours.";
const ACCOUNT_PROMPT = "Create your account to track your estimate in real time";
// An owner who already works with us adds a property from New property in the app instead.
function ExistingClient({ className = "estimate-alt" }: { className?: string }) {
  return <p className={className}>Already work with us? Sign in to the <a href={site.ownerLogin}>Recharge app</a> and choose New property.</p>;
}

type Status = { kind: "idle" | "sending" | "ok" } | { kind: "err"; message: string };

// `proposal` is for the Guaranteed Rent page: the same form and the same fields, with the wording of a rent proposal.
export function OwnerEnquiry({ proposal = false }: { proposal?: boolean }) {
  const api = site.enquiry.api.replace(/\/$/, "");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Kept after sending, so the account prompt can carry the same email.
  const [sentFrom, setSentFrom] = useState({ name: "", email: "" });

  if (!api) {
    // Until the app accepts this website's origin, owners use the live form in the app.
    return (
      <div className="estimate-card">
        <strong className="h3">{proposal ? "Free guaranteed rent proposal" : "Free performance estimate"}</strong>
        <p>Fill in our short property form. {proposal ? "A member of the team will be in touch with your free proposal by email." : REPLY}</p>
        <p className="estimate-sub">The form asks for:</p>
        <ul className="checks single">{ASKS.map((a) => <li key={a}><Check size={18} /> {a}</li>)}</ul>
        <a className="btn btn-mint" href={site.enquiry.formUrl} target="_blank" rel="noopener">Start your free {proposal ? "proposal" : "estimate"} <ArrowUpRight size={18} /></a>
        <p className="estimate-alt">Prefer to talk? <a href={site.phone.href}><Phone size={15} /> {site.phone.display}</a> <a href={`mailto:${site.email}`}><Mail size={15} /> {site.email}</a></p>
        <ExistingClient />
      </div>
    );
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const answers: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(f)) if (v.trim() !== "") answers[k] = ["bedrooms", "wcs", "bathrooms"].includes(k) ? Number(v) : v.trim();
    setStatus({ kind: "sending" });
    try {
      const post = (body: object) => fetch(`${api}/api/enquiry`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const started = await post({ action: "start" });
      const token = started.ok ? (await started.json())?.data?.token : null;
      if (!token) throw new Error("start");
      const res = await post({ token, answers });
      if (res.ok) { setSentFrom({ name: f.fullName?.trim() ?? "", email: f.email?.trim() ?? "" }); setStatus({ kind: "ok" }); form.reset(); return; }
      const data = await res.json().catch(() => null);
      setStatus({ kind: "err", message: data?.error ?? "Please check your answers and try again." });
    } catch {
      setStatus({ kind: "err", message: `We could not send this just now. Please use the form in the Recharge app, call ${site.phone.display} or email ${site.email}.` });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="estimate-card" role="status">
        <strong className="h3">Thank you{sentFrom.name ? `, ${sentFrom.name.split(/\s+/)[0]}` : ""}</strong>
        <p>We have your details. {proposal ? "A member of the team will be in touch with your free guaranteed rent proposal by email." : REPLY}</p>
        <a className="btn btn-mint" href={appSignUp(sentFrom.email)}>{ACCOUNT_PROMPT} <UserPlus size={18} /></a>
        {sentFrom.email && <p className="estimate-alt">Use {sentFrom.email} so your property is added to your account.</p>}
      </div>
    );
  }

  const select = (name: string, options: (string | number)[], required = true) => (
    <select id={`enq-${name}`} name={name} required={required} defaultValue="">
      <option value="">Choose</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-row">
        <div className="field"><label htmlFor="enq-fullName">Full name</label><input id="enq-fullName" name="fullName" autoComplete="name" required minLength={2} maxLength={200} /></div>
        <div className="field"><label htmlFor="enq-email">Email <span className="opt">we send your estimate here</span></label><input id="enq-email" name="email" type="email" autoComplete="email" required maxLength={320} /></div>
      </div>
      <div className="field"><label htmlFor="enq-phone">Contact number <span className="opt">optional</span></label><input id="enq-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="07700 900123" /></div>
      <div className="field"><label htmlFor="enq-propertyAddress">Property address</label><textarea id="enq-propertyAddress" name="propertyAddress" rows={2} required minLength={5} maxLength={1000} placeholder="Include the postcode" /></div>
      <div className="form-row form-row-4">
        <div className="field"><label htmlFor="enq-propertyType">Property type</label>{select("propertyType", PROPERTY_TYPES)}</div>
        <div className="field"><label htmlFor="enq-bedrooms">Bedrooms</label>{select("bedrooms", ROOMS)}</div>
        <div className="field"><label htmlFor="enq-wcs">WCs</label>{select("wcs", ROOMS)}</div>
        <div className="field"><label htmlFor="enq-bathrooms">Full bathrooms</label>{select("bathrooms", ROOMS)}</div>
      </div>
      <div className="field"><label htmlFor="enq-mediaLink">Link to photos or videos <span className="opt">optional. To upload files instead, use the <a href={site.enquiry.formUrl} target="_blank" rel="noopener">form in the app</a></span></label><input id="enq-mediaLink" name="mediaLink" type="url" inputMode="url" maxLength={1000} placeholder="https://" /></div>
      <div className="form-row">
        <div className="field"><label htmlFor="enq-enquiryType">Stage you are at <span className="opt">there is no wrong answer</span></label>{select("enquiryType", STAGES)}</div>
        <div className="field"><label htmlFor="enq-startWhen">When would you like to start? <span className="opt">optional</span></label>{select("startWhen", START_WHEN, false)}</div>
      </div>
      <div className="form-row">
        <div className="field"><label htmlFor="enq-heardFrom">How did you hear about us?</label>{select("heardFrom", HEARD_FROM)}</div>
        <div className="field"><label htmlFor="enq-referral">Referral <span className="opt">if someone referred you, who was it? Optional</span></label><input id="enq-referral" name="referral" maxLength={300} /></div>
      </div>
      <div className="field"><label htmlFor="enq-notes">Anything else we should know? <span className="opt">optional</span></label><textarea id="enq-notes" name="notes" rows={3} maxLength={3000} /></div>
      <button className="btn btn-mint" type="submit" disabled={status.kind === "sending"}>{status.kind === "sending" ? "Sending" : proposal ? "Get my free proposal" : "Get my free estimate"}</button>
      {status.kind === "err" && <p className="form-note" role="alert">{status.message} <a href={site.enquiry.formUrl} target="_blank" rel="noopener">Open the form in the app</a></p>}
      <ExistingClient className="form-note" />
    </form>
  );
}
