"use client";

// The dashboard's connection to the website's database, in the browser. Signed-in admins read and write through it; row level
// security decides what each person may do. Sessions are kept under their own key so they never mix with anything else.
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./supabase-config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { storageKey: "recharge-admin", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

// Calls one of the dashboard's server routes as the signed-in admin.
export async function adminFetch(path: string, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return fetch(path, { ...init, headers: { ...(init.headers ?? {}), ...(token ? { authorization: `Bearer ${token}` } : {}), ...(init.body ? { "content-type": "application/json" } : {}) }, cache: "no-store" });
}
