// Owner and guest enquiries. Saving to Firebase and the email through Resend are connected later;
// until then this checks the details and answers 503 so the form shows the email and phone instead.

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const enquiry = {
    type: text(body.type, 40),
    name: text(body.name, 120),
    email: text(body.email, 200),
    phone: text(body.phone, 40),
    postcode: text(body.postcode, 12),
    bedrooms: text(body.bedrooms, 20),
    message: text(body.message, 4000),
  };
  if (!enquiry.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  return Response.json({ error: "not_connected" }, { status: 503 });
}
