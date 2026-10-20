import { BadgeCheck, Building2, Camera, Clock, Globe, MapPin, MessageSquare, Phone as PhoneIcon, PoundSterling, Sparkles, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { clamp, ease, ep, handheld, lerp, prog } from "../anim";
import { Cursor } from "../components/Cursor";
import { Broll, Browser, Card, Label, Phone } from "../components/Kit";
import SITE from "../site-pos.json";
import { C, FONT } from "../theme";
import { CUT, L, T, wordTime } from "../timeline";

/*
  The scenes of the advertisement, in story order. Each one decides when it is on screen and owns
  its transition into the next, so neighbours overlap for half a second at every cut.
*/
const H = T / 2;
const on = (t: number, a: number, b: number) => t >= a - H && t <= b + H;

/* Moments other parts of the film (the sound effects) need. */
export const AT = {
  hookCards: [wordTime("hook", "Guests"), wordTime("hook", "cleans"), wordTime("hook", "repairs"), wordTime("hook", "owners")],
  logo: L.brand.start,
  pins: [wordTime("brand", "Glasgow"), wordTime("brand", "Edinburgh"), wordTime("brand", "Central")],
  clickArea: wordTime("book", "find") + 0.1,
  clickSearch: wordTime("book", "book direct") + 0.15,
  badge: wordTime("book", "ten"),
  cleanCard: L.clean.start + 0.1,
  ticks: [0, 1, 2, 3].map((i) => wordTime("clean", "checklist") + i * 0.22),
  flash: wordTime("clean", "photo"),
  fixSteps: [wordTime("fix", "logged"), wordTime("fix", "assigned"), wordTime("fix", "fixed")],
  ready: wordTime("fix", "arrives"),
  ownerCards: [wordTime("owners", "booking"), wordTime("owners", "statement"), wordTime("owners", "payout")],
  ownerPhone: wordTime("owners", "live"),
  chat: [L.support.start + 0.05, wordTime("support", "hand") - 0.1],
  allDay: wordTime("support", "twenty"),
  endLogo: L.cta.start,
  tagline: wordTime("cta", "Short"),
  buttons: wordTime("cta", "Book direct"),
  endClick: wordTime("cta", "recharge stays") + 0.2,
  chips: wordTime("cta", "dot"),
};

/* 1. The work: a host on her phone while the jobs pile up. The stack opens into the brand scene. */
export function Hook({ t }: { t: number }) {
  if (t > CUT.brand + H) return null;
  const ex = ep(t, CUT.brand - H, CUT.brand + H, ease.inOut);
  const shake = t > wordTime("hook", "all at once") ? Math.sin(t * 40) * 3 * (1 - prog(t, wordTime("hook", "all at once") + 0.5, L.hook.end)) : 0;
  const cards = [
    { icon: <MessageSquare size={30} />, title: "New guest message", text: "Edinburgh apartment, just now" },
    { icon: <Sparkles size={30} />, title: "Clean due at 11:00", text: "Glasgow, checkout today" },
    { icon: <Wrench size={30} />, title: "Boiler not heating", text: "Repair reported" },
    { icon: <PoundSterling size={30} />, title: "Owner statement due", text: "October payout" },
  ];
  const box = { x: lerp(100, 0, ex), y: lerp(150, 0, ex), w: lerp(640, 1920, ex), h: lerp(700, 1080, ex), r: lerp(32, 0, ex) };
  return (
    <AbsoluteFill style={{ background: C.abyss }}>
      <div style={{ position: "absolute", inset: 0, filter: `blur(${ex * 10}px)` }}>
        <Broll src="img/woman-phone-home.webp" t={t} from={0} to={CUT.brand} focus="62% 40%" />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)`, opacity: 1 - ep(t, CUT.brand - H, CUT.brand - H + 0.15) }}>
        {cards.map((c, i) => <Card key={c.title} t={t} at={AT.hookCards[i]} icon={c.icon} title={c.title} text={c.text} style={{ left: 120, top: 170 + i * 165 }} />)}
      </div>
      {t > CUT.brand - H && <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: box.r, background: C.paper, opacity: clamp(ex * 4) }} />}
    </AbsoluteFill>
  );
}

/* 2. Who we are: the logo, then the places we work, pinned along the Central Belt. */
export function Brand({ t }: { t: number }) {
  if (!on(t, CUT.brand, CUT.book)) return null;
  const logo = ep(t, AT.logo - 0.05, AT.logo + 0.45, ease.back);
  const chip = ep(t, wordTime("brand", "serviced"), wordTime("brand", "serviced") + 0.35, ease.back);
  const line = ep(t, wordTime("brand", "homes") - 0.1, AT.pins[2] + 0.3, ease.soft);
  const exit = ep(t, CUT.book - H, CUT.book + H, ease.in);
  const cities = [{ name: "Glasgow", x: 470 }, { name: "Edinburgh", x: 960 }, { name: "Central Belt", x: 1450 }];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(110% 90% at 50% 35%, ${C.paper} 50%, ${C.cream} 100%)`, transform: `scale(${1 + exit * 0.5})`, opacity: 1 - exit }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <Img src={staticFile("brand/recharge-logo-forest.png")} style={{ width: 960, opacity: clamp(logo * 2), transform: `scale(${lerp(1.25, 1, logo)})`, filter: `blur(${(1 - clamp(logo)) * 12}px)` }} />
        <div style={{ padding: "12px 26px", borderRadius: 999, background: C.forest, color: C.cream, font: `600 30px ${FONT}`, opacity: chip, transform: `translateY(${(1 - chip) * 20}px) scale(${lerp(0.9, 1, chip)})` }}>Serviced accommodation in Scotland</div>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path d="M 300 760 C 600 700, 800 820, 1000 760 S 1400 700, 1620 760" fill="none" stroke={C.moss} strokeOpacity="0.35" strokeWidth="5" strokeDasharray="2 14" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${line} 1` }} />
      </svg>
      {cities.map((c, i) => {
        const p = ep(t, AT.pins[i], AT.pins[i] + 0.4, ease.back);
        return (
          <div key={c.name} style={{ position: "absolute", left: c.x - 150, top: 640, width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * -60}px)` }}>
            <MapPin size={64} color={C.forest} fill={C.mint} strokeWidth={1.8} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 18, background: C.white, boxShadow: "0 20px 40px -20px rgba(21,45,40,.45)", font: `600 30px ${FONT}`, color: C.ink }}>
              <Building2 size={26} color={C.moss} /> {c.name}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

/* 3. Book: our real website. The pointer fills the search and books; the saving lands as a badge. */
export function Book({ t }: { t: number }) {
  if (!on(t, CUT.book, CUT.clean)) return null;
  const enter = ep(t, CUT.book - H, CUT.book + H + 0.2, ease.out);
  const whip = ep(t, CUT.clean - H, CUT.clean + H, ease.in);
  const W = 1300, k = W / 1440;
  const filled = t >= AT.clickArea + 0.25;
  const punch = ep(t, AT.clickSearch, AT.clickSearch + 0.25) * 0.05;
  // The pointer: from the lower right to Where, then to Search.
  const toArea = ep(t, AT.clickArea - 0.8, AT.clickArea - 0.05, ease.inOut);
  const toSearch = ep(t, AT.clickSearch - 0.7, AT.clickSearch - 0.05, ease.inOut);
  const px = lerp(lerp(1300, SITE.area.x, toArea), SITE.search.x, toSearch) * k;
  const py = lerp(lerp(800, SITE.area.y, toArea), SITE.search.y, toSearch) * k + 52;
  const press = (at: number) => (t >= at && t < at + 0.4 ? prog(t, at, at + 0.4) : 0);
  const badge = ep(t, AT.badge - 0.05, AT.badge + 0.35, ease.back);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(80% 80% at 50% 45%, ${C.forest} 0%, ${C.abyss} 100%)`, transform: `translateX(${-whip * 1920}px)`, filter: `blur(${whip * 14}px)` }}>
      <AbsoluteFill style={{ perspective: 2600, alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `translateY(${(1 - enter) * 200}px) rotateX(${lerp(26, 8, enter)}deg) rotateY(${lerp(-22, -6, enter)}deg) scale(${lerp(0.8, 1, enter) + punch})`, opacity: clamp(enter * 2) }}>
          <Browser width={W} url="rechargestays.co.uk">
            <Img src={staticFile("site/site-hero.webp")} style={{ position: "absolute", width: "100%", height: "100%" }} />
            <Img src={staticFile("site/site-filled.webp")} style={{ position: "absolute", width: "100%", height: "100%", opacity: filled ? 1 : 0 }} />
            {t > L.book.start && <Cursor x={px} y={py - 52} press={press(AT.clickArea) || press(AT.clickSearch)} opacity={ep(t, L.book.start, L.book.start + 0.3)} />}
          </Browser>
          <div style={{ position: "absolute", right: -50, top: -60, width: 230, height: 230, borderRadius: "50%", background: C.mint, color: C.deep, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 60px -20px rgba(0,0,0,.5)", opacity: clamp(badge * 2), transform: `scale(${badge}) rotate(${lerp(-30, -8, badge)}deg)` }}>
            <div style={{ font: `700 92px/1 ${FONT}`, letterSpacing: "-0.04em" }}>10%</div>
            <div style={{ font: `700 28px ${FONT}`, marginTop: 6 }}>off direct</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* 4. Clean: a clean is created from the booking, the checklist ticks, the photos upload. */
export function Clean({ t }: { t: number }) {
  if (!on(t, CUT.clean, CUT.fix)) return null;
  const enter = ep(t, CUT.clean - H, CUT.clean + H, ease.out);
  const up = ep(t, CUT.fix - H, CUT.fix + H, ease.in);
  const rows = ["Bedrooms reset", "Kitchen cleaned", "Bathroom cleaned", "Fresh linen on"];
  const flash = 1 - prog(t, AT.flash, AT.flash + 0.3);
  const upload = ep(t, AT.flash + 0.15, L.clean.end + 0.2, ease.soft);
  const phone = ep(t, CUT.clean, CUT.clean + 0.6, ease.out);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(110% 90% at 60% 40%, ${C.paper} 50%, ${C.cream} 100%)`, transform: `translateX(${(1 - enter) * 1920}px) translateY(${-up * 1080}px)` }}>
      <div style={{ position: "absolute", left: 150, top: 230, width: 640 }}>
        <Label style={{ color: C.moss }}>Turnover clean</Label>
        <div style={{ font: `700 56px/1.1 ${FONT}`, letterSpacing: "-0.03em", color: C.ink, margin: "14px 0 30px" }}>Edinburgh apartment</div>
        <div style={{ borderRadius: 26, background: C.white, boxShadow: "0 30px 60px -30px rgba(21,45,40,.45)", padding: "14px 28px" }}>
          {rows.map((r, i) => {
            const p = ep(t, AT.ticks[i], AT.ticks[i] + 0.25, ease.back);
            return (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 0", borderBottom: i < 3 ? `1px solid ${C.sand}` : "none", font: `600 30px ${FONT}`, color: C.ink }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, border: `3px solid ${p > 0 ? C.forest : C.sand}`, background: p > 0 ? C.forest : "transparent", display: "grid", placeItems: "center", transform: `scale(${lerp(0.7, 1, p || 1)})` }}>
                  {p > 0 && <BadgeCheck size={26} color={C.mint} />}
                </div>
                {r}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderRadius: 22, background: C.forest, color: C.cream, font: `600 28px ${FONT}`, opacity: ep(t, AT.flash, AT.flash + 0.3) }}>
          <Camera size={30} color={C.mint} />
          <div style={{ flex: 1 }}>
            {Math.round(lerp(1, 12, upload))} photos uploaded
            <div style={{ marginTop: 10, height: 8, borderRadius: 8, background: "rgba(167,217,193,.2)" }}><div style={{ width: `${upload * 100}%`, height: "100%", borderRadius: 8, background: C.mint }} /></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1060, top: 70, transform: `translateY(${(1 - phone) * 160}px)`, opacity: phone }}>
        <Phone src="app/cleaner-calendar.webp" width={430}>
          <AbsoluteFill style={{ background: C.white, opacity: t >= AT.flash ? flash * 0.9 : 0 }} />
        </Phone>
        <Card t={t} at={AT.cleanCard} icon={<Sparkles size={30} />} title="Clean booked" text="From the new booking" accent style={{ left: 300, top: 120, whiteSpace: "nowrap" }} />
      </div>
    </AbsoluteFill>
  );
}

/* 5. Fix: the real Recharge app. A repair is logged, assigned and stamped fixed. */
export function Fix({ t }: { t: number }) {
  if (!on(t, CUT.fix, CUT.owners)) return null;
  const enter = ep(t, CUT.fix - H, CUT.fix + H, ease.out);
  const W = 1240, k = W / 1440;
  const row = { x: 430 * k, y: 447 * k };
  const hover = ep(t, AT.fixSteps[0] - 0.6, AT.fixSteps[0] - 0.05, ease.inOut);
  const stamp = ep(t, AT.fixSteps[2], AT.fixSteps[2] + 0.2, ease.back);
  const steps = [{ label: "Logged", note: "Boiler, Edinburgh" }, { label: "Assigned", note: "Ready team" }, { label: "Fixed", note: "Engineer signed off" }];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(80% 80% at 40% 45%, ${C.forest} 0%, ${C.abyss} 100%)`, transform: `translateY(${(1 - enter) * 1080}px)` }}>
      <AbsoluteFill style={{ perspective: 2600 }}>
        <div style={{ position: "absolute", left: 90, top: 150, transform: "rotateY(10deg) rotateX(4deg)", transformOrigin: "0% 50%" }}>
          <Browser width={W} url="rechargegroup.co.uk/workspace">
            <Img src={staticFile("desk/d-home.webp")} style={{ position: "absolute", width: "100%", height: "100%" }} />
            <div style={{ position: "absolute", left: 124 * k, top: 418 * k, width: 1000 * k, height: 58 * k, borderRadius: 10, boxShadow: `0 0 0 ${3 + hover * 2}px rgba(167,217,193,${hover})`, background: `rgba(167,217,193,${hover * 0.15})` }} />
            <Cursor x={lerp(800 * k, row.x, hover)} y={lerp(700 * k, row.y, hover)} press={t >= AT.fixSteps[0] && t < AT.fixSteps[0] + 0.4 ? prog(t, AT.fixSteps[0], AT.fixSteps[0] + 0.4) : 0} opacity={ep(t, CUT.fix, CUT.fix + 0.3)} />
            <div style={{ position: "absolute", left: 760 * k, top: 380 * k, padding: "10px 28px", border: `6px solid ${C.moss}`, borderRadius: 14, color: C.moss, font: `800 64px ${FONT}`, letterSpacing: "0.08em", background: "rgba(252,250,245,.85)", opacity: clamp(stamp * 2), transform: `rotate(-8deg) scale(${lerp(2.2, 1, stamp)})` }}>FIXED</div>
          </Browser>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 1430, top: 240, display: "flex", flexDirection: "column", gap: 22 }}>
        {steps.map((s, i) => {
          const p = ep(t, AT.fixSteps[i], AT.fixSteps[i] + 0.35, ease.back);
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 26px 18px 18px", borderRadius: 22, background: i === 2 ? C.mint : "rgba(252,250,245,.96)", color: C.ink, opacity: clamp(p * 2), transform: `translateX(${(1 - p) * 80}px)`, boxShadow: "0 24px 50px -24px rgba(0,0,0,.5)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: i === 2 ? C.deep : C.wash, color: i === 2 ? C.mint : C.forest, display: "grid", placeItems: "center", font: `700 24px ${FONT}` }}>{i + 1}</div>
              <div style={{ font: `700 30px ${FONT}` }}>{s.label}<div style={{ font: `500 22px ${FONT}`, color: C.muted }}>{s.note}</div></div>
            </div>
          );
        })}
        <Card t={t} at={AT.ready} icon={<Clock size={30} />} title="Ready for check-in" text="Next guest at 15:00" accent style={{ position: "relative" }} />
      </div>
    </AbsoluteFill>
  );
}

/* 6. Owners: the owner follows everything in the app. Opens as a circle from the right. */
export function Owners({ t }: { t: number }) {
  if (!on(t, CUT.owners, CUT.support)) return null;
  const r = ep(t, CUT.owners - H, CUT.owners + H, ease.inOut);
  const whip = ep(t, CUT.support - H, CUT.support + H, ease.in);
  const phone = ep(t, AT.ownerPhone - 0.3, AT.ownerPhone + 0.3, ease.out);
  const cards = [
    { icon: <BadgeCheck size={30} />, title: "Booking confirmed", text: "2 nights, Edinburgh" },
    { icon: <MessageSquare size={30} />, title: "Statement ready", text: "October" },
    { icon: <PoundSterling size={30} />, title: "Payout approved", text: "Paid to your account", accent: true },
  ];
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r * 130}% at 80% 50%)`, transform: `translateX(${whip * 1920}px)`, filter: `blur(${whip * 14}px)`, background: C.cream }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 1080, overflow: "hidden" }}>
        <Img src={staticFile("img/woman-laptop-phone.webp")} style={{ width: 900, height: 1080, objectFit: "cover", objectPosition: "50% 30%", transform: `scale(${lerp(1.04, 1.12, prog(t, CUT.owners, CUT.support))}) ${handheld(t, 1.1)}`, transformOrigin: "50% 35%" }} />
      </div>
      <div style={{ position: "absolute", left: 960, top: 210, display: "flex", flexDirection: "column", gap: 22 }}>
        <Label style={{ color: C.moss, marginBottom: 6 }}>For owners</Label>
        {cards.map((c, i) => <Card key={c.title} t={t} at={AT.ownerCards[i]} icon={c.icon} title={c.title} text={c.text} accent={c.accent} style={{ position: "relative" }} />)}
      </div>
      <div style={{ position: "absolute", left: 1440, top: 90, opacity: phone, transform: `translateY(${(1 - phone) * 200}px)` }}>
        <Phone src="app/owner-reports.webp" width={410} />
      </div>
    </AbsoluteFill>
  );
}

/* 7. Support: a real person answers, day or night. */
export function Support({ t }: { t: number }) {
  if (!on(t, CUT.support, CUT.cta)) return null;
  const enter = ep(t, CUT.support - H, CUT.support + H, ease.out);
  const close = ep(t, CUT.cta - H, CUT.cta + H, ease.inOut);
  const big = ep(t, AT.allDay, AT.allDay + 0.35, ease.back);
  const bubble = (at: number, text: string, me: boolean): ReactNode => {
    const p = ep(t, at, at + 0.3, ease.back);
    return (
      <div style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: 560, padding: "20px 26px", borderRadius: 26, borderBottomLeftRadius: me ? 26 : 6, borderBottomRightRadius: me ? 6 : 26, background: me ? C.mint : C.white, color: C.ink, font: `600 30px/1.35 ${FONT}`, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 30}px) scale(${lerp(0.9, 1, p)})`, boxShadow: "0 24px 50px -24px rgba(0,0,0,.5)" }}>{text}</div>
    );
  };
  return (
    <AbsoluteFill style={{ transform: `translateX(${(1 - enter) * -1920}px)` }}>
      <Broll src="img/support-agent.webp" t={t} from={CUT.support} to={CUT.cta} focus="62% 35%" />
      <div style={{ position: "absolute", left: 120, top: 230, width: 660, display: "flex", flexDirection: "column", gap: 18 }}>
        {bubble(AT.chat[0], "Hi, can we check in a little early?", false)}
        {bubble(AT.chat[1], "Of course. Your home is ready from 1pm.", true)}
      </div>
      <div style={{ position: "absolute", left: 120, top: 620, display: "flex", alignItems: "center", gap: 22, opacity: clamp(big * 2), transform: `scale(${big})`, transformOrigin: "0% 50%" }}>
        <div style={{ font: `800 150px/1 ${FONT}`, letterSpacing: "-0.05em", color: C.cream }}>24/7</div>
        <div style={{ font: `600 34px/1.25 ${FONT}`, color: C.mint }}>Real people,<br />any hour</div>
      </div>
      <AbsoluteFill style={{ background: C.forest, clipPath: `circle(${close * 120}% at 50% 50%)` }} />
    </AbsoluteFill>
  );
}

/* 8. The end card: logo, promise, the two ways in, and where to find us. */
export function Cta({ t }: { t: number }) {
  if (t < CUT.cta - H) return null;
  const logo = ep(t, AT.endLogo - 0.05, AT.endLogo + 0.45, ease.back);
  const tag = ep(t, AT.tagline, AT.tagline + 0.4, ease.out);
  const btn = ep(t, AT.buttons, AT.buttons + 0.4, ease.back);
  const chips = ep(t, AT.chips, AT.chips + 0.4, ease.out);
  const move = ep(t, AT.endClick - 0.7, AT.endClick - 0.05, ease.inOut);
  const press = t >= AT.endClick && t < AT.endClick + 0.4 ? prog(t, AT.endClick, AT.endClick + 0.4) : 0;
  const lit = t >= AT.endClick;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 90% at 50% 40%, ${C.forest} 0%, ${C.abyss} 100%)`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, transform: "translateY(-30px)" }}>
        <Img src={staticFile("brand/recharge-logo-cream.png")} style={{ width: 880, opacity: clamp(logo * 2), transform: `scale(${lerp(1.25, 1, logo)})`, filter: `blur(${(1 - clamp(logo)) * 12}px)` }} />
        <div style={{ font: `700 72px ${FONT}`, letterSpacing: "-0.03em", color: C.cream, opacity: tag, transform: `translateY(${(1 - tag) * 24}px)` }}>Short stays, <span style={{ color: C.mint }}>run properly.</span></div>
        <div style={{ display: "flex", gap: 20, marginTop: 10, opacity: clamp(btn * 2), transform: `scale(${lerp(0.9, 1, btn)})` }}>
          <div style={{ position: "relative", padding: "24px 44px", borderRadius: 999, background: lit ? C.cream : C.mint, color: C.deep, font: `700 34px ${FONT}`, transform: `scale(${press > 0 ? 0.96 : 1})` }}>
            Book a stay
            {t > AT.buttons + 0.3 && <Cursor x={lerp(380, 200, move)} y={lerp(120, 50, move)} press={press} opacity={ep(t, AT.buttons + 0.3, AT.buttons + 0.6) * (1 - ep(t, AT.endClick + 0.8, AT.endClick + 1.1))} />}
          </div>
          <div style={{ padding: "24px 44px", borderRadius: 999, border: `3px solid rgba(239,233,219,.5)`, color: C.cream, font: `700 34px ${FONT}` }}>Get an owner estimate</div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, opacity: chips, transform: `translateY(${(1 - chips) * 20}px)` }}>
          {[{ i: <Globe size={26} />, s: "rechargestays.co.uk" }, { i: <PhoneIcon size={26} />, s: "0141 375 9450" }, { i: <Clock size={26} />, s: "Support 24/7" }].map((c) => (
            <div key={c.s} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 999, background: "rgba(239,233,219,.08)", border: "1px solid rgba(239,233,219,.16)", color: C.cream, font: `600 28px ${FONT}` }}>
              <span style={{ color: C.mint, display: "flex" }}>{c.i}</span>{c.s}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}
