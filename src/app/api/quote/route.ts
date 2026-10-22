import { getCatalog } from "@/content/catalog";
import { hostawayConnected, quote } from "@/lib/hostaway";

// A price for one home and a range of dates: every night's rate, the cleaning fee and the total,
// with any booked nights and the minimum stay. Only our own homes can be priced.
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { homes } = await getCatalog();
  const home = homes.find((h) => h.slug === url.searchParams.get("home"));
  const checkin = url.searchParams.get("checkin") ?? "";
  const checkout = url.searchParams.get("checkout") ?? "";
  if (!home || !DATE.test(checkin) || !DATE.test(checkout)) return Response.json({ error: "invalid" }, { status: 400 });
  const nights = (Date.parse(checkout) - Date.parse(checkin)) / 86_400_000;
  const today = new Date().toISOString().slice(0, 10);
  if (!(nights >= 1 && nights <= 365) || checkin < today) return Response.json({ error: "dates" }, { status: 400 });
  if (!hostawayConnected()) return Response.json({ error: "not_connected" }, { status: 503 });
  try {
    const q = await quote(home.hostawayId, checkin, checkout);
    return Response.json(q, { headers: { "cache-control": "private, max-age=60" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
