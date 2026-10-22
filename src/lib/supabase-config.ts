// The website's own Supabase project ("Recharge Website": the dashboard's changes, discounts and admin accounts).
// Both values are public by design: the publishable key is what browsers use, and row level security decides what it may
// do (anyone can read what the site shows; only signed-in admins can change anything). Environment variables win if set.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arxerajvwtrndolfsfcn.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_H5JZSbrH_Hy4UMHr8BMPiw_92qowozL";
