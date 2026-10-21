// Live prices and availability from Hostaway, for the booking panel. Server only: the account ID
// and API key come from HOSTAWAY_ACCOUNT_ID and HOSTAWAY_API_KEY and never reach the browser.

const API = "https://api.hostaway.com/v1";
let token: { value: string; until: number } | null = null;

export const hostawayConnected = () => !!(process.env.HOSTAWAY_ACCOUNT_ID && process.env.HOSTAWAY_API_KEY);

async function accessToken() {
  if (token && token.until > Date.now()) return token.value;
  const res = await fetch(`${API}/accessTokens`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "cache-control": "no-cache" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.HOSTAWAY_ACCOUNT_ID!, client_secret: process.env.HOSTAWAY_API_KEY!, scope: "general" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`hostaway token ${res.status}`);
  const data = await res.json();
  // Tokens last much longer than this; an hour keeps a stale one from lingering.
  token = { value: data.access_token, until: Date.now() + 60 * 60 * 1000 };
  return token.value;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: { authorization: `Bearer ${await accessToken()}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`hostaway ${res.status}`);
  return (await res.json()).result as T;
}

type Day = { date: string; isAvailable: number; status: string; price: number; minimumStay?: number };
type Listing = { cleaningFee?: number; minNights?: number; maxNights?: number; personCapacity?: number; currencyCode?: string };

export type Quote = {
  nights: number;
  nightly: { date: string; price: number }[];
  subtotal: number;
  cleaningFee: number;
  total: number;
  currency: string;
  available: boolean;
  unavailable: string[];
  minStay: number;
  maxGuests?: number;
};

const addDays = (iso: string, n: number) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export async function quote(listingId: number, checkin: string, checkout: string): Promise<Quote> {
  const lastNight = addDays(checkout, -1);
  const [listing, days] = await Promise.all([
    get<Listing>(`/listings/${listingId}`),
    get<Day[]>(`/listings/${listingId}/calendar?startDate=${checkin}&endDate=${lastNight}`),
  ]);
  const nightly = days.map((d) => ({ date: d.date, price: Number(d.price) || 0 }));
  const unavailable = days.filter((d) => !d.isAvailable || d.status !== "available").map((d) => d.date);
  const subtotal = nightly.reduce((n, d) => n + d.price, 0);
  const cleaningFee = Number(listing.cleaningFee) || 0;
  return {
    nights: nightly.length,
    nightly,
    subtotal,
    cleaningFee,
    total: subtotal + cleaningFee,
    currency: listing.currencyCode || "GBP",
    available: unavailable.length === 0 && nightly.length > 0,
    unavailable,
    minStay: Number(days[0]?.minimumStay ?? listing.minNights ?? 1),
    maxGuests: listing.personCapacity,
  };
}
