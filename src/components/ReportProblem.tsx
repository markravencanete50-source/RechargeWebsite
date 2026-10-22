"use client";

import { AlertTriangle, ArrowRight, Check, MessageCircle, Phone, Search } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { TeamChat, useTeamChat, type ChatContact } from "./TeamChat";

export type ReportHome = { slug: string; title: string; town: string };

// What can go wrong, in the guest's words. Urgent ones put the phone number first: a call is faster than any message.
const GUEST_PROBLEMS = [
  { id: "locked-out", label: "I cannot get in", urgent: true },
  { id: "water-leak", label: "Water leak or flooding", urgent: true },
  { id: "no-heat", label: "No heating or hot water", urgent: true },
  { id: "no-power", label: "No electricity", urgent: true },
  { id: "alarm", label: "An alarm is going off", urgent: true },
  { id: "appliance", label: "Something is broken", urgent: false },
  { id: "wifi", label: "Wifi or TV", urgent: false },
  { id: "clean", label: "Cleaning or supplies", urgent: false },
  { id: "noise", label: "Noise or neighbours", urgent: false },
  { id: "other", label: "Something else", urgent: false },
];
// What neighbours tell us about, in their words. A party or a security worry is something to call about while it is happening.
const NEIGHBOUR_PROBLEMS = [
  { id: "noise", label: "Noise", urgent: false },
  { id: "party", label: "A party or a large group", urgent: true },
  { id: "parking", label: "Parking", urgent: false },
  { id: "bins", label: "Bins or rubbish", urgent: false },
  { id: "security", label: "A door left open or a security worry", urgent: true },
  { id: "other", label: "Something else", urgent: false },
];
type Who = "guest" | "neighbour";

// "Report a problem": a guest during their stay, or a neighbour of one of our homes, picks the home and what is wrong, and the chat
// with the team opens with the report written out. It goes to the team's inbox in the Recharge app, the same as every website
// chat, and replies come back into the same window.
export function ReportProblem({ homes, contact }: { homes: ReportHome[]; contact: ChatContact }) {
  const [who, setWho] = useState<Who>("guest");
  const [query, setQuery] = useState("");
  const [home, setHome] = useState<ReportHome | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [open, setOpen] = useState(false);
  const neighbour = who === "neighbour";
  const problems = neighbour ? NEIGHBOUR_PROBLEMS : GUEST_PROBLEMS;
  const chatHome = useMemo(() => (home ? { slug: home.slug, title: home.title } : { slug: "report-a-problem", title: neighbour ? "one of our homes" : "your stay" }), [home, neighbour]);
  const team = useTeamChat(chatHome, open);
  const close = useCallback(() => setOpen(false), []);
  const picked = problems.find((p) => p.id === problem);
  const choose = (w: Who) => { setWho(w); setProblem(null); };

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return homes.filter((h) => `${h.title} ${h.town}`.toLowerCase().includes(q)).slice(0, 6);
  }, [homes, query]);

  const draft = [
    neighbour ? `I live near ${home ? home.title : "one of your homes"} and want to report something.` : `I have a problem during my stay${home ? ` at ${home.title}` : ""}.`,
    picked ? `${neighbour ? "What is happening" : "What is wrong"}: ${picked.label}.` : "",
    details.trim(),
  ].filter(Boolean).join(" ");

  return (
    <div className="report">
      <div className="report-who" role="radiogroup" aria-label="Who is reporting">
        <button type="button" role="radio" aria-checked={!neighbour} onClick={() => choose("guest")}>I am staying in a Recharge home</button>
        <button type="button" role="radio" aria-checked={neighbour} onClick={() => choose("neighbour")}>I am a neighbour</button>
      </div>
      <div className="report-step">
        <span className="report-num">1</span>
        <div>
          <h3>{neighbour ? "Which home is it about?" : "Where are you staying?"}</h3>
          {home ? (
            <p className="report-picked"><Check size={16} /> {home.title}{home.title.includes(home.town) ? "" : `, ${home.town}`} <button type="button" onClick={() => { setHome(null); setQuery(""); }}>Change</button></p>
          ) : (
            <div className="report-search">
              <label className="report-input"><Search size={16} /><input placeholder="Type the town or the home's name" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find your home" /></label>
              {matches.length > 0 && (
                <ul className="report-matches">
                  {matches.map((h) => <li key={h.slug}><button type="button" onClick={() => setHome(h)}>{h.title}<small>{h.town}</small></button></li>)}
                </ul>
              )}
              {query.trim() && matches.length === 0 && <p className="report-hint">No home matches that. You can still send your report: {neighbour ? "give the street or the building in the details." : "say where you are staying in the details."}</p>}
              {neighbour && !query.trim() && <p className="report-hint">Type the town. If you are not sure which home it is, skip this and describe where in the details.</p>}
            </div>
          )}
        </div>
      </div>

      <div className="report-step">
        <span className="report-num">2</span>
        <div>
          <h3>{neighbour ? "What is happening?" : "What is wrong?"}</h3>
          <div className="report-chips">
            {problems.map((p) => <button key={p.id} type="button" aria-pressed={problem === p.id} onClick={() => setProblem(p.id)}>{p.label}</button>)}
          </div>
          {picked?.urgent && (
            <div className="report-urgent" role="alert">
              <AlertTriangle size={20} />
              <div>
                <strong>{neighbour ? "Happening now? Please call us." : "This is urgent. Please call us now."}</strong>
                <span>{neighbour
                  ? "We answer day and night, and we can contact the guests straight away. If anyone is in danger, call 999."
                  : "Calling is the fastest way to reach the team, at any hour. If anyone is in danger, call 999. If you smell gas, leave the home and call the gas emergency line on 0800 111 999."}</span>
                <a className="btn btn-mint" href={contact.phone.href}><Phone size={18} /> Call {contact.phone.display}</a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="report-step">
        <span className="report-num">3</span>
        <div>
          <h3>Tell us more</h3>
          <textarea rows={4} maxLength={2000} value={details} onChange={(e) => setDetails(e.target.value)} placeholder={neighbour ? "For example: loud music from the top floor flat since 11pm." : "For example: the shower runs cold since this morning. The boiler shows a red light."} aria-label="Details" />
          <button type="button" className="btn btn-primary" disabled={!problem} onClick={() => setOpen(true)}>
            <MessageCircle size={18} /> {team.session ? "Open your chat" : "Send to the team"} <ArrowRight size={18} />
          </button>
          <p className="report-hint">{problem ? "The chat opens with your report filled in. Add your name and email, and the team replies in the same window." : `Choose ${neighbour ? "what is happening" : "what is wrong"} first.`}</p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <TeamChat home={chatHome} contact={contact} chat={team} stay={null} onClose={close}
            intro={neighbour
              ? `Hi, this is the Recharge team. Thank you for telling us. We look into every report from neighbours. For anything happening now, call ${contact.phone.display}.`
              : `Hi, this is the Recharge team. Tell us what is wrong and we will sort it out. For anything urgent, call ${contact.phone.display}.`}
            draft={team.session ? "" : draft} />
        )}
      </AnimatePresence>
    </div>
  );
}
