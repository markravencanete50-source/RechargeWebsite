// The dashboard's list of Hostaway homes as Hostaway has them (the base the dashboard's changes sit on), and every amenity used
// across them for the amenity picker. Admins only.
import { adminFrom, noStore, refuse } from "@/lib/admin-server";
import { homes } from "@/content/properties";

export async function GET(request: Request) {
  if (!(await adminFrom(request))) return refuse();
  const listings = homes.map((h) => ({
    hostawayId: h.hostawayId, slug: h.slug, title: h.title, description: h.description ?? "", amenities: h.amenities,
    photo: h.photos[0]?.src ?? null, region: h.region, town: h.town, bedrooms: h.bedrooms, price: h.price ?? null,
  }));
  const vocabulary = [...new Set(homes.flatMap((h) => h.amenities))].sort((a, b) => a.localeCompare(b));
  return Response.json({ listings, vocabulary }, { headers: noStore });
}
