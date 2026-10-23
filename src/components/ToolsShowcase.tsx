"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { teams } from "@/content/tools";

// Every tool in the Recharge app, grouped by the team that uses it. All panels are in the HTML,
// so search engines read every tool; the tabs only choose which one is shown.
export function ToolsShowcase() {
  const [active, setActive] = useState(teams[0].id);
  const reduce = useReducedMotion();
  const id = useId();
  return (
    <div className="tools">
      <div className="tabs tools-tabs" role="tablist" aria-label="Teams">
        {teams.map((t) => (
          <button key={t.id} id={`${id}-${t.id}-tab`} role="tab" aria-selected={active === t.id} aria-controls={`${id}-${t.id}`} className="tab" onClick={() => setActive(t.id)}>
            {t.name}<span className="tab-count">{t.tools.length}</span>
          </button>
        ))}
      </div>
      {teams.map((t) => (
        <div key={t.id} id={`${id}-${t.id}`} role="tabpanel" aria-labelledby={`${id}-${t.id}-tab`} hidden={active !== t.id}>
          <p className="tools-lead"><strong>{t.brand}.</strong> {t.lead}</p>
          <ul className="tool-grid">
            {t.tools.map((tool, i) => (
              <motion.li
                key={tool.name}
                className="tool"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={active === t.id ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <span className="tool-for">{tool.for}</span>
                <strong>{tool.name}</strong>
                <p>{tool.does}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
