// Is this guest new? Asked when a booking request is sent. The address is turned into a keyed hash here, on the server, and only
// the hash goes to the database, which records the first request from each address (see the discount_claims migration).
import { createHmac } from "node:crypto";
import { SUPABASE_KEY, SUPABASE_URL } from "./supabase-config";

const hmac = (key: string, value: string) => createHmac("sha256", key).update(value).digest("hex");

export async function claimNewGuest(email: string, chat: string | null): Promise<boolean> {
  const key = process.env.RECHARGE_WEBSITE_KEY;
  if (!key) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/claim_new_guest`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, authorization: `Bearer ${SUPABASE_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ p_email_hash: hmac(key, `new-guest:${email.toLowerCase()}`), p_ref: chat ? hmac(key, `new-guest-chat:${chat}`) : null }),
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    return res.ok && (await res.json()) === true;
  } catch {
    return false;
  }
}
