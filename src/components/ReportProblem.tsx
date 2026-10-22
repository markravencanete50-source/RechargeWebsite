"use client";

import { AlertTriangle, ArrowRight, Check, MessageCircle, Phone, Search } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { TeamChat, useTeamChat, type ChatContact } from "./TeamChat";

export type ReportHome = { slug: string; title: string; town: string };

// What can go wrong, in the guest's words. Urgent ones put the phone number first: a call is faster than any message.
const PROBLEMS = [
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
] as const;
type ProblemId = (typeof PROBLEMS)[number]["id"];

// "Report a problem during your stay": the guest picks their home and what is wrong, and the chat with the team opens with the
// report written out. It goes to the team's guest inbox in the Recharge app, the same as every website chat, and replies come
// back into the same window.
export function ReportProblem({ homes, contact }: { homes: ReportHome[]; contact: ChatContact }) {
  const [query, setQuery] = useState("");
  const [home, setHome] = useState<ReportHome | null>(null);
  const [problem, setProblem] = useState<ProblemId | null>(null);
  const [details, setDetails] = useState("");
  const [open, setOpen] = useState(false);
  const chatHome = useMemo(() => (home ? { slug: home.slug, title: home.title } : { slug: "report-a-problem", title: "your stay" }), [home]);
  const team = useTeamChat(chatHome, open);
  const close = useCallback(() => setOpen(false), []);
  const picked = PROBLEMS.find((p) => p.id === problem);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return homes.filter((h) => `${h.title} ${h.town}`.toLowerCase().includes(q)).slice(0, 6);
  }, [homes, query]);

  const draft = [
    `I have a problem during my stay${home ? ` at ${home.title}` : ""}.`,
    picked ? `What is wrong: ${picked.label}.` : "",
    details.trim(),
  ].filter(Boolean).join(" ");

  return (
    <div className="report">
      <div className="report-step">
        <span className="report-num">1</span>
        <div>
          <h3>Where are you staying?</h3>
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
              {query.trim() && matches.length === 0 && <p className="report-hint">No home matches that. You can still send your report: say where you are staying in the details.</p>}
            </div>
          )}
        </div>
      </div>

      <div className="report-step">
        <span className="report-num">2</span>
        <div>
          <h3>What is wrong?</h3>
          <div className="report-chips">
            {PROBLEMS.map((p) => <button key={p.id} type="button" aria-pressed={problem === p.id} onClick={() => setProblem(p.id)}>{p.label}</button>)}
          </div>
          {picked?.urgent && (
            <div className="report-urgent" role="alert">
              <AlertTriangle size={20} />
              <div>
                <strong>This is urgent. Please call us now.</strong>
                <span>Calling is the fastest way to reach the team, at any hour. If anyone is in danger, call 999. If you smell gas, leave the home and call the gas emergency line on 0800 111 999.</span>
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
          <textarea rows={4} maxLength={2000} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="For example: the shower runs cold since this morning. The boiler shows a red light." aria-label="Details" />
          <button type="button" className="btn btn-primary" disabled={!problem} onClick={() => setOpen(true)}>
            <MessageCircle size={18} /> {team.session ? "Open your chat" : "Send to the team"} <ArrowRight size={18} />
          </button>
          <p className="report-hint">{problem ? "The chat opens with your report filled in. Add your name and email, and the team replies in the same window." : "Choose what is wrong first."}</p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <TeamChat home={chatHome} contact={contact} chat={team} stay={null} onClose={close}
            intro={`Hi, this is the Recharge team. Tell us what is wrong and we will sort it out. For anything urgent, call ${contact.phone.display}.`}
            draft={team.session ? "" : draft} />
        )}
      </AnimatePresence>
    </div>
  );
}
