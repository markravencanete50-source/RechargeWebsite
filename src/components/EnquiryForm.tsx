"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { site } from "@/content/site";

type Status = { kind: "idle" | "sending" } | { kind: "ok" } | { kind: "err"; message: string };

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      if (res.ok) { setStatus({ kind: "ok" }); form.reset(); return; }
      setStatus({ kind: "err", message: res.status === 400 ? "Please check the fields and try again." : `We could not send this just now. Please email ${site.email} or call ${site.phone.display}.` });
    } catch {
      setStatus({ kind: "err", message: `We could not send this just now. Please email ${site.email} or call ${site.phone.display}.` });
    }
  }

  return (
    <form className="form" onSubmit={submit} noValidate={false}>
      <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend>I am</legend>
        <div className="choice" style={{ marginTop: 8 }}>
          {["A property owner", "A guest", "Something else"].map((v, i) => (
            <label key={v}><input type="radio" name="type" value={v} defaultChecked={i === 0} /><span>{v}</span></label>
          ))}
        </div>
      </fieldset>
      <div className="form-row">
        <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" required /></div>
        <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
      </div>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="form-row">
        <div className="field"><label htmlFor="postcode">Property postcode</label><input id="postcode" name="postcode" autoComplete="postal-code" /></div>
        <div className="field">
          <label htmlFor="bedrooms">Bedrooms</label>
          <select id="bedrooms" name="bedrooms" defaultValue="">
            <option value="">Choose</option>
            <option>Studio</option><option>1</option><option>2</option><option>3</option><option>4 or more</option>
          </select>
        </div>
      </div>
      <div className="field"><label htmlFor="message">Anything else</label><textarea id="message" name="message" /></div>
      {status.kind === "ok" && <p className="form-status ok" role="status">Thank you. We have your details and will be in touch.</p>}
      {status.kind === "err" && <p className="form-status err" role="alert">{status.message}</p>}
      <button className="btn btn-primary" type="submit" disabled={status.kind === "sending"} style={{ justifySelf: "start" }}>
        {status.kind === "sending" ? "Sending" : "Send enquiry"} <ArrowRight size={18} />
      </button>
      <p className="form-note">We only use these details to reply to you.</p>
    </form>
  );
}
