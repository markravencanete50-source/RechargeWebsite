import { allTools } from "@/content/tools";

// Tool names drifting past in two rows, in opposite directions.
export function ToolMarquee() {
  const half = Math.ceil(allTools.length / 2);
  const rows = [allTools.slice(0, half), allTools.slice(half)];
  return (
    <div className="tool-marquee" aria-hidden>
      {rows.map((row, r) => (
        <div key={r} className={`tool-marquee-row${r ? " reverse" : ""}`}>
          <div className="tool-marquee-track">
            {[...row, ...row].map((t, i) => (
              <span key={`${t.name}-${i}`}><t.icon size={18} /> {t.name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
