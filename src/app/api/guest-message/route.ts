import { getCatalog } from "@/content/catalog";
import { discountsFor } from "@/content/discounts";
import { claimNewGuest } from "@/lib/new-guest";

// A guest's message from a property page, with their booking details if they were pricing a stay.
// It goes to the Recharge app's guest inbox (the Stays Communication Centre) once the app's
// endpoint is set in RECHARGE_GUEST_MESSAGES_URL with its key in RECHARGE_WEBSITE_KEY. Until
// then this answers 503 and the panel offers email and phone instead. A message from the chat window carries the chat's key, so the
// team's replies come back to that window (see /api/guest-chat).

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CHAT = /^[A-Za-z0-9_-]{32,128}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  // A hidden field people never fill in; bots usually do.
  if (text(body.website, 200)) return Response.json({ ok: true });

  const { homes, discounts } = await getCatalog();
  const home = homes.find((h) => h.slug === text(body.home, 200));
  const booking = (body.booking ?? {}) as Record<string, unknown>;
  const message = {
    source: "website",
    home: home ? { slug: home.slug, hostawayListingId: home.hostawayId || null, town: home.town } : null,
    name: text(body.name, 120),
    email: text(body.email, 200),
    phone: text(body.phone, 40),
    body: text(body.message, 4000),
    booking: DATE.test(text(booking.checkin, 10)) && DATE.test(text(booking.checkout, 10))
      ? { checkin: text(booking.checkin, 10), checkout: text(booking.checkout, 10), guests: Number(booking.guests) || undefined, total: Number(booking.total) || undefined, currency: text(booking.currency, 3) || "GBP" }
      : null,
    sentAt: new Date().toISOString(),
    ...(CHAT.test(text(body.chat, 128)) ? { chat: text(body.chat, 128) } : {}),
  };
  if (!message.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.email) || !message.body) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const target = process.env.RECHARGE_GUEST_MESSAGES_URL;
  const key = process.env.RECHARGE_WEBSITE_KEY;
  if (!target || !key) return Response.json({ error: "not_connected" }, { status: 503 });

  // A booking request says which discounts it gets, worked out here rather than trusted from the browser: today's best offer for
  // the home's area, and the new-guest discount the first time this email address asks for a stay.
  if (home && message.booking) {
    const { offer, newGuest } = discountsFor(discounts, home.region);
    const lines = [offer && `${offer.label}: ${offer.percent}% off the nightly price.`];
    if (newGuest && await claimNewGuest(message.email, message.chat ?? null)) lines.push(`${newGuest.label}: ${newGuest.percent}% off the nightly price, as this is the first request from this email address.`);
    const note = lines.filter(Boolean).join(" ");
    if (note) message.body = `${message.body.slice(0, 3990 - note.length)}\n\nDiscounts: ${note}`;
  }
  try {
    const res = await fetch(target, { method: "POST", headers: { "content-type": "application/json", "x-recharge-website-key": key }, body: JSON.stringify(message), cache: "no-store" });
    if (!res.ok) return Response.json({ error: "not_delivered" }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "not_delivered" }, { status: 502 });
  }
}
