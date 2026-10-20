import { ArrowRight, ArrowUpRight, Check, Clock, MapPin, Plus, Smartphone, Mail, Phone, Home as HomeIcon } from "lucide-react";
import { AppShowcase } from "@/components/AppShowcase";
import { DiffVideo } from "@/components/DiffVideo";
import { EnquiryForm } from "@/components/EnquiryForm";
import { HeroStage } from "@/components/HeroStage";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { SupportClock } from "@/components/SupportClock";
import { homes } from "@/content/photos";
import { site } from "@/content/site";

const faqs = [
  { q: "How do I book a stay?", a: `Book direct on our booking site and get ${site.directDiscount} off your stay. You can also find our homes on the major booking platforms.` },
  { q: "What is guaranteed rent?", a: "We rent your property for a fixed monthly amount and run it as serviced accommodation. You receive the same rent every month, whether the property is booked or not." },
  { q: "What does full management include?", a: "Listings, daily pricing, guest messages, check-in, cleaning, laundry, repairs and monthly statements. You can see all of it in the Recharge app." },
  { q: "Do I need a short-term let licence?", a: "In Scotland, short lets need a licence from the local council. We help you through the application and keep your licence details in order." },
  { q: "How do I see what is happening at my property?", a: "Through the Recharge app. You see bookings, cleans, repairs, statements and payouts, and you approve costs from your phone." },
  { q: "Can I reach someone out of hours?", a: "Yes. Support runs 24 hours a day, 7 days a week, for guests and owners." },
];

const marquee = ["Glasgow", "Edinburgh", "Paisley", "Livingston", "Guaranteed rent", "Full management", "24/7 support", `Book direct and save ${site.directDiscount}`];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="orbit" style={{ width: 900, height: 900, right: -260, top: -200 }} />
          <span className="orbit" style={{ width: 620, height: 620, right: -120, top: -60 }} />
        </div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <Reveal><p className="eyebrow">Serviced accommodation in Scotland</p></Reveal>
            <Reveal delay={0.05}>
              <h1 className="h1">Short stays, <span className="accent">run properly.</span></h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">
                We manage serviced apartments and homes across Glasgow, Edinburgh and the Central Belt. Guests book direct with us. Owners hand over the keys and follow everything in one app.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="hero-actions">
                <a className="btn btn-primary" href={site.bookingUrl} target="_blank" rel="noopener">Book a stay <ArrowRight size={18} /></a>
                <a className="btn btn-ghost" href="#contact">Get an owner estimate</a>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="hero-proof">
                <span><HomeIcon size={18} /> {site.homesManaged} homes managed</span>
                <span><Clock size={18} /> Support 24/7</span>
                <span><Smartphone size={18} /> One app for everyone</span>
              </div>
            </Reveal>
          </div>
          <HeroStage />
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <span key={n}>{marquee.map((m) => <span key={m + n} style={{ padding: 0 }}>{m}<i /></span>)}</span>
          ))}
        </div>
      </div>

      {/* Guests and owners */}
      <section className="section" id="stay">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Two ways in</p>
            <h2 className="h2">Staying with us, or letting with us?</h2>
          </Reveal>
          <div className="split">
            <Reveal>
              <a className="split-card light" href={site.bookingUrl} target="_blank" rel="noopener">
                <div style={{ display: "grid", gap: 16 }}>
                  <p className="eyebrow" style={{ margin: 0 }}>For guests</p>
                  <h3 className="h2" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>Stay with us</h3>
                  <p className="muted" style={{ margin: 0 }}>Clean, well kept homes for city breaks, work trips and families.</p>
                  <ul>
                    <li><Check size={18} /> Book direct and save {site.directDiscount}</li>
                    <li><Check size={18} /> Check-in details before you arrive</li>
                    <li><Check size={18} /> Help any time, day or night</li>
                  </ul>
                </div>
                <span className="split-go"><span className="arrow"><ArrowUpRight size={20} /></span> See homes and book</span>
              </a>
            </Reveal>
            <Reveal delay={0.1}>
              <a className="split-card deep" href="#owners">
                <div style={{ display: "grid", gap: 16 }}>
                  <p className="eyebrow" style={{ margin: 0 }}>For property owners</p>
                  <h3 className="h2" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>Let us run your property</h3>
                  <p style={{ margin: 0, opacity: 0.78 }}>Guaranteed rent or full management. Either way, you see every booking, clean, repair and payout in the app.</p>
                  <ul>
                    <li><Check size={18} /> Fixed rent or short-let earnings</li>
                    <li><Check size={18} /> Cleaning, repairs and guests handled</li>
                    <li><Check size={18} /> Statements and approvals on your phone</li>
                  </ul>
                </div>
                <span className="split-go"><span className="arrow"><ArrowUpRight size={20} /></span> See owner options</span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why we are different: the film */}
      <section className="section dark on-dark" id="different">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Why Recharge</p>
            <h2 className="h2">Most managers send a spreadsheet. <span className="accent">We built an app.</span></h2>
            <p className="lead">Owners, guests, cleaners and maintenance all work from one Recharge app, with a real person on hand 24 hours a day.</p>
          </Reveal>
          <Reveal><DiffVideo /></Reveal>
          <div className="diff-grid">
            {[
              ["Owners", "Live bookings, statements and approvals on your phone."],
              ["Guests", "Messages answered quickly, at any hour."],
              ["Cleaners", "Schedules, checklists and photo proof for every clean."],
              ["Maintenance", "Repairs logged, assigned and tracked to the finish."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="diff">
                <span className="num">0{i + 1}</span>
                <strong className="h3" style={{ fontSize: 20 }}>{t}</strong>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The app */}
      <section className="section" id="app">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">The Recharge app</p>
            <h2 className="h2">One app. Everyone on the same page.</h2>
            <p className="lead">Each person sees what they need, for the homes they look after, and nothing else.</p>
          </Reveal>
          <AppShowcase />
        </div>
      </section>

      {/* Owner options */}
      <section className="section paper" id="owners">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">For owners</p>
            <h2 className="h2">Two ways to work with us</h2>
            <p className="lead">Choose the arrangement that suits you. We handle everything else.</p>
          </Reveal>
          <div className="offer">
            <Reveal className="plan">
              <span className="plan-tag">Fixed income</span>
              <h3 className="h2" style={{ fontSize: "clamp(28px,3vw,38px)" }}>Guaranteed rent</h3>
              <p className="muted" style={{ margin: 0 }}>A fixed monthly rent, paid on time, whether the property is booked or not.</p>
              <ul>
                <li><Check size={18} /> The same rent every month</li>
                <li><Check size={18} /> No empty months to cover</li>
                <li><Check size={18} /> We furnish, list, clean and maintain</li>
                <li><Check size={18} /> Your property kept to a hotel standard</li>
              </ul>
              <p className="fit">Best if you want a steady, predictable income.</p>
            </Reveal>
            <Reveal className="plan feature on-dark" delay={0.1}>
              <span className="plan-tag">Short-let earnings</span>
              <h3 className="h2" style={{ fontSize: "clamp(28px,3vw,38px)" }}>Full management</h3>
              <p style={{ margin: 0, opacity: 0.78 }}>We run your property as a short let. You keep the earnings after our fee.</p>
              <ul>
                <li><Check size={18} /> Prices reviewed every day</li>
                <li><Check size={18} /> Listed on all major booking sites</li>
                <li><Check size={18} /> Cleaning, laundry and repairs handled</li>
                <li><Check size={18} /> Statements and payouts in the app</li>
              </ul>
              <p className="fit">Best if you want the most from your property.</p>
            </Reveal>
          </div>
          <Reveal className="section-head" >
            <div style={{ marginTop: "clamp(64px, 9vw, 110px)" }}>
              <p className="eyebrow">How it works</p>
              <h2 className="h2">From first call to first guest</h2>
            </div>
          </Reveal>
          <div className="steps">
            {[
              ["Tell us about your property", "Send a few details. We come back with an estimate."],
              ["Agree and sign", "Read the agreement and sign it inside the app."],
              ["We get it ready", "Inspection, furnishing, photos and listings, all handled."],
              ["Guests arrive", "We run every stay. You follow along in the app."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="step">
                <span className="step-num">{i + 1}</span>
                <strong className="h3">{t}</strong>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{ marginTop: 40 }}>
              <a className="btn btn-primary" href="#contact">Get your free estimate <ArrowRight size={18} /></a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Homes */}
      <section className="section" id="homes">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Our homes</p>
            <h2 className="h2">A few of the homes we look after</h2>
          </Reveal>
          <div className="homes">
            {homes.map((h, i) => (
              <Reveal key={h.name} delay={i * 0.06}>
                <a className="home-card" href={site.bookingUrl} target="_blank" rel="noopener">
                  <div className="home-photo"><Photo photo={h.photo} sizes="(max-width: 980px) 50vw, 25vw" /></div>
                  <div className="home-meta">
                    <strong>{h.name}</strong>
                    <span className="muted" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}><MapPin size={15} /> {h.area}</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{ marginTop: 40 }}>
              <a className="btn btn-ghost" href={site.bookingUrl} target="_blank" rel="noopener">See all homes and book <ArrowUpRight size={18} /></a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 24/7 support */}
      <section className="section dark on-dark" id="support">
        <div className="wrap support">
          <div>
            <Reveal className="section-head" >
              <p className="eyebrow">24/7 support</p>
              <h2 className="h2">Someone is always there.</h2>
              <p className="lead">Guests, owners and our own team can reach Recharge at any hour. Urgent problems are picked up and passed to the right person straight away.</p>
            </Reveal>
            <div className="support-list">
              {[
                ["Guests", "Help with check-in, wifi or anything in the home."],
                ["Owners", "Answers on bookings, statements and repairs."],
                ["Cleaners", "Report a problem from the phone and it goes to the right team."],
                ["Maintenance", "Urgent repairs sent out, day or night."],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.06} className="support-item"><strong>{t}</strong><p>{d}</p></Reveal>
              ))}
            </div>
          </div>
          <Reveal><SupportClock /></Reveal>
        </div>
      </section>

      {/* Areas */}
      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Where we work</p>
            <h2 className="h2">Across Scotland&apos;s Central Belt</h2>
            <p className="lead">Thinking of somewhere else? Ask us. We are growing.</p>
          </Reveal>
          <div className="areas">
            {site.areas.map((a, i) => (
              <Reveal key={a} delay={i * 0.06}><span className="area"><MapPin size={20} /> {a}</span></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section paper" id="faq">
        <div className="wrap faq-grid">
          <Reveal className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2 className="h2">Good questions</h2>
            <p className="lead">Something else on your mind? Call {site.phone.display} or email us.</p>
          </Reveal>
          <Reveal className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}<span className="plus"><Plus size={18} /></span></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section className="section dark on-dark" id="contact">
        <div className="wrap contact">
          <Reveal>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <p className="eyebrow">Get in touch</p>
              <h2 className="h2">Get your free estimate</h2>
              <p className="lead">Tell us about your property, or ask us anything about a stay. We will be in touch.</p>
            </div>
            <div className="contact-lines">
              <a href={site.phone.href}><span className="ic"><Phone size={20} /></span>{site.phone.display}</a>
              <a href={`mailto:${site.email}`}><span className="ic"><Mail size={20} /></span>{site.email}</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><EnquiryForm /></Reveal>
        </div>
      </section>
    </>
  );
}
