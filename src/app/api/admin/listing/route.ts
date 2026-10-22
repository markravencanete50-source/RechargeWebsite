// Saves the dashboard's changes to one Hostaway home: shown or hidden, its featured place, and an edited title, description or
// amenities (empty means "as in Hostaway"). With hostaway: true, the edited text and amenities are also sent to Hostaway, which
// passes them to Airbnb and Booking.com. The website's copy is saved first, so a Hostaway failure never loses the edit; the
// answer says what reached Hostaway. The site's pages refresh at once.
import { revalidateTag } from "next/cache";
import { adminFrom, noStore, refuse } from "@/lib/admin-server";
import { label } from "@/content/home-utils";
import { homes } from "@/content/properties";
import { hostawayConnected, updateHostawayListing, type HostawayResult } from "@/lib/hostaway";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const admin = await adminFrom(request);
  if (!admin) return refuse();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400, headers: noStore }); }

  const base = homes.find((h) => h.hostawayId === Number(body.hostawayId));
  if (!base) return Response.json({ error: "Unknown listing." }, { status: 404, headers: noStore });
  const title = text(body.title, 200), description = text(body.description, 20000);
  const amenities = Array.isArray(body.amenities) ? [...new Set(body.amenities.map((a) => text(a, 80)).filter(Boolean))].slice(0, 200) : null;
  const rank = body.featuredRank === null || body.featuredRank === "" ? null : Math.round(Number(body.featuredRank));
  if (rank !== null && !(rank >= 1 && rank <= 100)) return Response.json({ error: "Featured position must be 1 to 100." }, { status: 400, headers: noStore });

  // Only what differs from Hostaway is kept as an override.
  const sameAmenities = amenities && amenities.length === base.amenities.length && amenities.every((a) => base.amenities.includes(a));
  const row = {
    hostaway_id: base.hostawayId,
    published: body.published !== false,
    featured_rank: rank,
    title: title && title !== base.title ? title : null,
    description: description && description !== (base.description ?? "") ? description : null,
    amenities: amenities && !sameAmenities ? amenities : null,
  };
  const { error } = await admin.db.from("listing_overrides").upsert(row);
  if (error) return Response.json({ error: `Not saved: ${error.message}` }, { status: 400, headers: noStore });
  revalidateTag("catalog", { expire: 0 });

  let hostaway: HostawayResult | { error: string } | null = null;
  if (body.hostaway === true && (row.title || row.description || row.amenities)) {
    if (!hostawayConnected()) hostaway = { error: "Hostaway is not connected on the website." };
    else {
      try {
        hostaway = await updateHostawayListing(base.hostawayId, {
          title: row.title ?? undefined,
          description: row.description ?? undefined,
          addAmenities: row.amenities ? row.amenities.filter((a) => !base.amenities.includes(a)) : undefined,
          removeAmenities: row.amenities ? base.amenities.filter((a) => !row.amenities!.includes(a)) : undefined,
        }, label);
      } catch (e) {
        hostaway = { error: e instanceof Error ? e.message : "Hostaway could not be reached." };
      }
    }
  }
  return Response.json({ ok: true, hostaway }, { headers: noStore });
}
