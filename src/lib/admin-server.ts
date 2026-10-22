// The dashboard's server side. Every admin route starts here: the caller sends their Supabase session token, and is only let in
// if Supabase says the token is valid AND the database says they are an admin. Their writes then run as them, so the row level
// security rules and the audit log apply exactly as they would from the browser.
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./supabase-config";

export type AdminContext = { db: SupabaseClient; user: User };

export async function adminFrom(request: Request): Promise<AdminContext | null> {
  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token || token.length > 4096) return null;
  const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: isAdmin } = await db.rpc("is_admin");
  return isAdmin === true ? { db, user: data.user } : null;
}

export const noStore = { "cache-control": "no-store" };
export const refuse = () => Response.json({ error: "Sign in as an admin." }, { status: 401, headers: noStore });
