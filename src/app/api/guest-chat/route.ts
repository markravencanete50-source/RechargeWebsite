// The chat window reading its conversation back: the guest's messages and the team's replies, from the Recharge app. The chat's
// key comes in the body (never in an address) and goes on, with the website's key, to the app's guest-chat endpoint, which sits
// next to the guest-messages one set in RECHARGE_GUEST_MESSAGES_URL. Nothing here is cached.

const CHAT = /^[A-Za-z0-9_-]{32,128}$/;
const noStore = { "cache-control": "no-store" };

type Message = { id: string; from: "guest" | "team"; body: string; sentAt: string; name?: string | null };

export async function POST(request: Request) {
  let chat = "";
  try {
    const body = (await request.json()) as { chat?: unknown };
    chat = typeof body.chat === "string" ? body.chat : "";
  } catch {}
  if (!CHAT.test(chat)) return Response.json({ error: "invalid" }, { status: 400, headers: noStore });

  const target = process.env.RECHARGE_GUEST_MESSAGES_URL?.replace(/\/guest-messages\/?$/, "/guest-chat");
  const key = process.env.RECHARGE_WEBSITE_KEY;
  if (!target || !key) return Response.json({ error: "not_connected" }, { status: 503, headers: noStore });
  try {
    const res = await fetch(target, { method: "POST", headers: { "content-type": "application/json", "x-recharge-website-key": key }, body: JSON.stringify({ chat }), cache: "no-store" });
    if (!res.ok) return Response.json({ error: "unavailable" }, { status: res.status === 429 ? 429 : 502, headers: noStore });
    const data = (await res.json()) as { messages?: Message[] };
    // Only what the window shows, in a known shape.
    const messages = (Array.isArray(data.messages) ? data.messages : [])
      .filter((m) => m && typeof m.id === "string" && (m.from === "guest" || m.from === "team") && typeof m.body === "string" && typeof m.sentAt === "string")
      .map((m) => ({ id: m.id, from: m.from, body: m.body, sentAt: m.sentAt, ...(m.from === "team" && typeof m.name === "string" ? { name: m.name } : {}) }));
    return Response.json({ messages }, { headers: noStore });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502, headers: noStore });
  }
}
