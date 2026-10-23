"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { teams } from "@/content/tools";

// The homepage view of the app's tools: the five teams down the side, each with its count, and the chosen team's tools as a
// ruled list that says what each one does. Every panel is in the HTML, so search engines read all the tools; the buttons only choose one.
export function ToolExplorer() {
  const [active, setActive] = useState(teams[0].id);
  const reduce = useReducedMotion();
  const id = useId();
  return (
    <div className="tx">
      <div className="tx-teams" role="tablist" aria-label="Teams in the Recharge app" aria-orientation="vertical">
        {teams.map((t) => (
          <button key={t.id} id={`${id}-${t.id}-tab`} type="button" role="tab" aria-selected={active === t.id} aria-controls={`${id}-${t.id}`} onClick={() => setActive(t.id)}>
            <span className="tx-count">{t.tools.length}</span>
            <span className="tx-name"><small>{t.brand}</small>{t.name}</span>
            <ArrowRight size={18} className="tx-arrow" />
          </button>
        ))}
      </div>
      {teams.map((t) => (
        <div key={t.id} id={`${id}-${t.id}`} role="tabpanel" aria-labelledby={`${id}-${t.id}-tab`} hidden={active !== t.id} className="tx-panel">
          <p className="tx-lead">{t.lead}</p>
          <ul className="tx-grid">
            {t.tools.map((tool, i) => (
              <motion.li key={tool.name} className="tx-tool"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={active === t.id ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.4, delay: i * 0.035, ease: [0.2, 0.7, 0.2, 1] }}>
                <strong>{tool.name}</strong><p>{tool.does}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
