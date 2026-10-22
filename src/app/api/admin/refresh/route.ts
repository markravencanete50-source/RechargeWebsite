// Refreshes the website's pages at once after an admin saves something in the dashboard straight to the database (a website
// listing, a discount). Without it the change still appears, within a minute.
import { revalidateTag } from "next/cache";
import { adminFrom, noStore, refuse } from "@/lib/admin-server";

export async function POST(request: Request) {
  if (!(await adminFrom(request))) return refuse();
  revalidateTag("catalog", { expire: 0 });
  return Response.json({ ok: true }, { headers: noStore });
}
