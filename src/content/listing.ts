// Turns a listing description, written for Airbnb with emoji headings and bullets, into
// clean sections the property page can lay out: intro, highlights, rooms, nearby places,
// rules and other details. Anything it cannot place stays as a titled section, so no text is lost.

export type Room = { name: string; kind: "bedroom" | "living" | "kitchen" | "bathroom" | "dining" | "other"; items: string[]; sleeps?: number };
export type Place = { name: string; time?: string; note?: string };
export type Listing = {
  longStay: boolean;
  intro: string[];
  highlights: string[];
  rooms: Room[];
  places: Place[];
  rules: string[];
  details: { label?: string; text: string }[];
  included: string[];
  extra: { title: string; lines: string[] }[];
  placeNotes: string[];
};

const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}️‍⃣]/gu;

const BULLET = /^\s*(?:[-–•*·⦁]|⭐)/u;

function tidy(s: string) {
  return s.replace(EMOJI, "").replace(/^[\s\-–•*·⦁]+/, "").replace(/\s+/g, " ").trim();
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Sentence case for list items written in Title Case ("Fridge Freezer" -> "Fridge freezer").
function item(s: string) {
  let t = s
    .replace(/\bSinge\b/i, "Single")
    .replace(/\((\d+)x? guests?\)/i, "(sleeps $1)")
    .replace(/^(.{0,40}?),? sleeps (\d+) guests?$/i, "$1 (sleeps $2)")
    .replace(/([a-z])Bed\b/g, "$1 bed").replace(/\bDishwater\b/i, "Dishwasher").replace(/\bBreadtoaster\b/i, "Toaster")
    .replace(/\(for (\d+) guests?\)/i, "(for $1)")
    .replace(/\s*&\s*/g, " and ")
    .replace(/\.$/, "");
  t = t.replace(/^1\s*x?\s+(?=\D)/i, "").replace(/^(\d+)\s*x\s+/i, "$1 ").replace(/^(\d+) (\w.*?) beds?\b/i, (_, n, b) => `${n} ${b} bed${n === "1" ? "" : "s"}`);
  if (t.length < 50 && !/[a-z][A-Z]/.test(t)) t = t.charAt(0).toUpperCase() + t.slice(1).replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase());
  return t.replace(/\btv\b/gi, "TV").replace(/\bwi-?fi\b/gi, "Wi-Fi").replace(/\bwc\b/gi, "WC").replace(/\bnetflix\b/gi, "Netflix");
}

function roomKind(name: string): Room["kind"] {
  const n = name.toLowerCase();
  if (/bed ?room|suite|sleeping/.test(n)) return "bedroom";
  if (/living|lounge/.test(n)) return "living";
  if (/kitchen/.test(n)) return "kitchen";
  if (/bath|wc|shower/.test(n)) return "bathroom";
  if (/dining/.test(n)) return "dining";
  return "other";
}

type Mode = { type: "intro" | "highlights" | "rooms" | "room" | "places" | "rules" | "details" | "extra"; room?: Room; extra?: { title: string; lines: string[] } };

const ROOM_NAME = /^(the )?(master )?(bed ?rooms?( \d+)?|living (room|area)|living (and|&) dining( area)?|lounge|kitchen( (and|&) (lounge|dining))?|kitchenette|bathrooms?( (and|&) (wc|home comforts))?|dining (room|area)|other|wc|suite|laundry area|outside space)$/i;

// Decides whether a line is a section heading, and which section it opens.
// `raw` still has its emoji, `h` is the cleaned text, `nextLine` is the next non-empty cleaned line.
function classify(raw: string, h0: string, nextLine: string, current: Mode["type"] = "intro", afterBlank = true): Mode | "skip" | null {
  const colon = h0.endsWith(":");
  const h = h0.replace(/:$/, "").trim();
  const n = h.toLowerCase();
  const words = h.split(" ").length;
  const noStop = !/[.!?,;)]$/.test(h);
  const caps = h === h.toUpperCase() && /[A-Z]{3}/.test(h) && h.length < 40;
  const emojiLed = /^\s*\p{Extended_Pictographic}/u.test(raw) && !/^\s*⭐/u.test(raw) && words <= 5 && noStop;
  const keyword = roomKind(n) !== "other" || /nearby|location|attractions|rules|access|transport|getting around|travel|recreation|historic/.test(n);
  const inList = current === "room" || current === "places" || current === "rules" || current === "details";
  const titled = words <= 6 && noStop && /^[A-Z]/.test(h) && !/[(,]/.test(h) && (inList ? keyword && (nextLine.length > 60 || (nextLine.endsWith(":") && nextLine.split(" ").length > 4)) : nextLine.length > 60 || nextLine.endsWith(":"));
  const named = (ROOM_NAME.test(h) && (!inList || emojiLed || afterBlank)) || /^(property rules|house rules|nearby|space)$/i.test(h);
  const isHeading = (colon && (words <= 6 || /nearby|journey|features|contains|offers|includes|rules|accessible|explore|complete with|equipped with|deep rest/i.test(n))) || caps || emojiLed || titled || named;
  if (!isHeading || h.length > 90) return null;

  if (/^(the )?space$|features the following|property contains|description$|^the property$/.test(n)) return { type: "rooms" };
  if (/nearby|short journey|located near|accessible|placed to explore|historic|natural beauty|city exploration|outdoor activities|location|attractions|minutes from|nature and recreation/.test(n)) return { type: "places" };
  if (/transport|getting around|travel/.test(n)) return { type: "extra", extra: { title: "Getting around", lines: [] } };
  if (/rules/.test(n)) return { type: "rules" };
  if (/other details|guest access/.test(n)) return { type: "details" };
  if (/^(the )?(property )?(features|offers)|key features|^features$/.test(n)) return { type: "highlights" };
  if (/also includes|additional amenities|^other$|added convenience/.test(n)) return { type: "room", room: { name: "Also in the home", kind: "other", items: [] } };
  const kind = roomKind(n);
  if (ROOM_NAME.test(h) || (kind !== "other" && words <= 6)) {
    const name = cap(h.toLowerCase().replace(/^the /, "").replace(/ & /g, " and ").replace(/\bwc\b/, "WC"));
    return { type: "room", room: { name, kind, items: [] } };
  }
  if (/bedroom includes|deep rest/.test(n)) return { type: "room", room: { name: "Bedroom", kind: "bedroom", items: [] } };
  if (/bathroom (equipped|with)/.test(n)) return { type: "room", room: { name: "Bathroom", kind: "bathroom", items: [] } };
  if (/living (area|room).*complete with/.test(n)) return { type: "room", room: { name: "Living area", kind: "living", items: [] } };
  if (/kitchen(ette)? (includes|is)/.test(n)) return { type: "room", room: { name: "Kitchen", kind: "kitchen", items: [] } };
  if (n === "wi-fi") return "skip";
  if (colon && words > 6) return null; // a lead-in sentence, not a heading
  return { type: "extra", extra: { title: cap(h.toLowerCase().replace(/ & /g, " and ")), lines: [] } };
}

const RULE = /^(no |any damage|all guests|guests (are|will be) required|please|quiet hours|pets?\b|smoking)/i;

function place(line: string): Place {
  let name = line;
  let time: string | undefined;
  const paren = line.match(/^(.*?)\s*\(([^)]*\d[^)]*)\)\.?$/);
  const approx = line.match(/^(.*?),?\s+(?:approx\.?|about|around)\s+(\d.*)$/i);
  if (paren) { name = paren[1]; time = paren[2]; }
  else if (approx) { name = approx[1]; time = approx[2]; }
  const parts = name.split(/\s+[-–]\s+|:\s/);
  name = parts[0].replace(/[.:,]$/, "").replace(/\s*&\s*/g, " and ").trim();
  const note = parts.slice(1).join(" ").trim() || undefined;
  if (time) {
    time = time.replace(/^(approx\.?|about|around|~)\s*/i, "").replace(/’/g, "").replace(/(\d)\s*[–-]\s*(\d)/g, "$1 to $2").replace(/\bminutes?\b|\bmins?\b/g, "min").replace(/\bhours?\b|\bhrs?\b/g, "hr").replace(/\s*away$/, "").replace(/\.$/, "");
  }
  return { name, time, note };
}

const PLACE_LINE = /\(\s*(approx\.?\s*)?\d+\s*([–-]\s*\d+\s*)?(mins?|minutes?)|[–-]\s*\d+\s*minutes?$/i;

export function parseListing(description = "", houseRules = ""): Listing {
  const out: Listing = { longStay: false, intro: [], highlights: [], rooms: [], places: [], rules: [], details: [], included: [], extra: [], placeNotes: [] };
  let mode: Mode = { type: "intro" };
  const all = description.replace(/[\r\u{2028}\u{2029}]/gu, "\n").split("\n");
  const raws: string[] = [];
  const blankBefore: boolean[] = [];
  all.forEach((l, i) => { if (tidy(l)) { raws.push(l); blankBefore.push(i === 0 || !tidy(all[i - 1])); } });
  const clean = raws.map(tidy);

  for (let i = 0; i < raws.length; i++) {
    const rawLine = raws[i];
    let line = clean[i];
    if (/long[- ]?(term|stay) discounts? (are )?available/i.test(line) && line.length < 60) { out.longStay = true; continue; }
    if (/^discounts?:/i.test(line)) { out.longStay = true; continue; }
    if (/^[A-Z][\w' ]+, United Kingdom$/.test(line) || /^pick \d+ things/i.test(line)) continue; // map pins and authoring notes
    if (/^guests? will have access to the (whole|entire)/i.test(line)) { out.details.push({ label: "Entire home", text: line }); continue; }
    const access = line.match(/^(entire (space|property)|guest access):\s*(.+)$/i);
    if (access) { out.details.push({ label: "Entire home", text: access[3] }); continue; }

    // "Bedroom 1: Features a double bed." opens the room and keeps the text.
    const inline = line.match(/^([A-Za-z &]{3,30}):\s+(.{3,})$/);
    if (inline && ROOM_NAME.test(inline[1].trim())) {
      const opened = classify(rawLine, inline[1] + ":", "");
      if (opened && opened !== "skip" && opened.room) {
        mode = opened;
        out.rooms.push(opened.room);
        line = inline[2];
      }
    } else {
      const next = classify(rawLine, line, clean[i + 1] ?? "", mode.type, blankBefore[i]);
      if (next === "skip") continue;
      if (next) {
        mode = next;
        if (next.room) out.rooms.push(next.room);
        if (next.extra) {
          const same = out.extra.find((e) => e.title === next.extra!.title);
          if (same) mode = { type: "extra", extra: same };
          else out.extra.push(next.extra);
        }
        continue;
      }
    }

    if (/included( throughout your stay)?\.?$/i.test(line) && line.length < 60) { out.included.push(item(line.replace(/ is included throughout your stay/i, " included"))); continue; }
    if (RULE.test(line) && mode.type !== "intro") { out.rules.push(line.replace(/\.?$/, ".")); continue; }
    if (line.endsWith(":") && line.split(" ").length > 6) continue; // lead-in sentence inside a section

    switch (mode.type) {
      case "intro":
        if (BULLET.test(rawLine) && out.intro.length > 0) out.highlights.push(line.replace(/\.$/, ""));
        else out.intro.push(line);
        break;
      case "highlights":
        out.highlights.push(line.replace(/\.$/, ""));
        break;
      case "room": {
        if (PLACE_LINE.test(line)) { out.places.push(place(line)); break; }
        const it = item(line);
        if (mode.room!.items.includes(it)) break;
        mode.room!.items.push(it);
        const s = it.match(/\(sleeps (\d+)\)/i);
        if (s) mode.room!.sleeps = (mode.room!.sleeps ?? 0) + Number(s[1]);
        break;
      }
      case "places": {
        if (/reserve|book (now|today)|!$/i.test(line)) break;
        const p = place(line);
        if (p.name.length > 70) { out.placeNotes.push(line); break; }
        out.places.push(p);
        break;
      }
      case "rules":
        out.rules.push(line.replace(/\.?$/, "."));
        break;
      case "details": {
        const m = line.match(/^([A-Za-z ]{3,20}):\s*(.+)$/);
        if (m && /discount/i.test(m[1])) { out.longStay = true; break; }
        out.details.push(m ? { label: cap(m[1].trim().toLowerCase()), text: m[2] } : { text: line });
        break;
      }
      case "rooms":
        // Loose lines between the "space" heading and the first room are prose.
        out.intro.push(line);
        break;
      case "extra":
        mode.extra!.lines.push(line);
        break;
    }
  }

  for (const r of houseRules.replace(/[\r\u{2028}]/gu, "\n").split("\n").map(tidy).filter(Boolean)) {
    const rule = r.replace(/\.?$/, ".");
    if (!out.rules.some((x) => x.toLowerCase() === rule.toLowerCase())) out.rules.push(rule);
  }
  out.rooms = out.rooms.filter((r) => r.items.length > 0);
  out.extra = out.extra.filter((e) => e.lines.length > 0);
  out.rules = [...new Set(out.rules)];
  out.included = [...new Set(out.included)];
  out.places = out.places.filter((p) => p.name.length > 1);
  return out;
}

// Amenity groups for the "What this home offers" block.
const GROUPS: [string, RegExp][] = [
  ["Kitchen and dining", /kitchen|cook|oven|hob|stove|fridge|refrigerator|freezer|microwave|kettle|toaster|dish|coffee|utensil|dining|cutlery|wine|blender|barbecue|bbq/i],
  ["Bathroom", /bath|shower|toilet|hair ?dryer|shampoo|soap|gel|conditioner|towel|hot water|bidet/i],
  ["Bedroom and laundry", /bed|linen|pillow|blanket|wardrobe|clothing|hanger|iron|wash|dryer|drying|laundry|cot|crib/i],
  ["Entertainment and work", /tv|wifi|wi-fi|internet|netflix|cable|stream|workspace|desk|book|game|sound|console|piano/i],
  ["Safety", /smoke|carbon|first aid|fire|extinguisher|alarm|lock|safe|security|camera/i],
  ["Parking and access", /parking|garage|entrance|lift|elevator|step|ev charger|check-?in|keypad|lockbox/i],
  ["Heating and outdoors", /heating|fireplace|air con|fan|garden|patio|balcony|terrace|yard|outdoor|view|beach|lake/i],
  ["Families", /child|family|baby|high chair|kids/i],
];

export function groupAmenities(list: string[]) {
  const groups = new Map<string, string[]>();
  for (const a of list) {
    const g = GROUPS.find(([, re]) => re.test(a))?.[0] ?? "Everyday essentials";
    groups.set(g, [...(groups.get(g) ?? []), a]);
  }
  const order = [...GROUPS.map(([g]) => g), "Everyday essentials"];
  return order.filter((g) => groups.has(g)).map((g) => ({ name: g, items: groups.get(g)! }));
}

// The amenities guests look for first, in the order Airbnb and Booking.com lead with them.
const POPULAR = [/wi-?fi|wireless|internet/i, /free parking/i, /parking/i, /^kitchen$/i, /washing machine|washer/i, /smart tv|^tv$/i, /heating/i, /workspace|desk/i, /dishwasher/i, /hair ?dryer/i, /garden|patio|balcony/i, /long term/i, /coffee/i, /iron/i];

export function topAmenities(list: string[], n = 10) {
  const picked: string[] = [];
  for (const re of POPULAR) {
    const hit = list.find((a) => re.test(a) && !picked.includes(a));
    if (hit && !(re.source.includes("parking") && picked.some((p) => /parking/i.test(p)))) picked.push(hit);
    if (picked.length === n) return picked;
  }
  return [...picked, ...list.filter((a) => !picked.includes(a))].slice(0, n);
}
