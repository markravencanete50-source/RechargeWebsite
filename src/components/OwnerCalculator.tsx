"use client";

import { ArrowRight, Info } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { BEDROOMS, DIRECT, MANAGEMENT_FEES, OCCUPANCY, PLATFORM_FEE, SCENARIOS, project, type RateTable, type Scenario } from "@/content/estimate-sums";
import { RollingNumber } from "./RollingNumber";

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

// What a property could earn with Recharge: the owner estimate explorer from the Recharge app, with nightly rates from the
// homes we run. Choose the area and size, then a quieter, expected or strong year, the occupancy and the share booked
// direct, and see the year's booking income, the fees and what is left for the owner. A professional estimate is one tap away.
export function OwnerCalculator({ table }: { table: RateTable }) {
  const reduce = useReducedMotion();
  const uid = useId();
  const [area, setArea] = useState(table.areas.includes("Glasgow") ? "Glasgow" : table.areas[0]);
  const available = BEDROOMS.filter((b) => table.rates[area]?.[b]);
  const [bedsChoice, setBeds] = useState(2);
  const beds = available.includes(bedsChoice as (typeof BEDROOMS)[number]) ? bedsChoice : available[0];
  const [scenario, setScenario] = useState<Scenario>("medium");
  const [occupancy, setOccupancy] = useState(OCCUPANCY.start);
  const [direct, setDirect] = useState(DIRECT.start);
  const [fee, setFee] = useState<number>(MANAGEMENT_FEES[1]);
  const rates = table.rates[area]?.[beds];
  const result = useMemo(() => (rates ? project(rates[scenario], occupancy, direct, fee) : null), [rates, scenario, occupancy, direct, fee]);
  const share = (n: number) => (result && result.gross ? `${(n / result.gross) * 100}%` : "0%");

  return (
    <div className="calc">
      <div className="calc-inputs">
        <label className="calc-field">
          <span>Area</span>
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            {table.areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>

        <fieldset className="calc-field">
          <legend>Bedrooms</legend>
          <div className="calc-seg">
            {BEDROOMS.map((b) => (
              <button key={b} type="button" aria-pressed={beds === b} disabled={!available.includes(b)} onClick={() => setBeds(b)}>
                {beds === b && <motion.i layoutId={`${uid}-beds`} className="calc-seg-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span>{b === 5 ? "5+" : b}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="calc-field">
          <legend>What kind of year</legend>
          <div className="calc-seg calc-seg-wide">
            {SCENARIOS.map((s) => (
              <button key={s.id} type="button" aria-pressed={scenario === s.id} onClick={() => setScenario(s.id)}>
                {scenario === s.id && <motion.i layoutId={`${uid}-year`} className="calc-seg-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span><strong>{s.label}</strong>{rates && <small>{gbp(rates[s.id])} a night</small>}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className="calc-field">
          <span className="calc-row">Nights booked <b>{occupancy}%</b></span>
          <input type="range" min={OCCUPANCY.min} max={OCCUPANCY.max} step={OCCUPANCY.step} value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value))} style={{ ["--p" as string]: `${((occupancy - OCCUPANCY.min) / (OCCUPANCY.max - OCCUPANCY.min)) * 100}%` }} />
        </label>

        <label className="calc-field">
          <span className="calc-row">Booked direct, no platform fee <b>{direct}%</b></span>
          <input type="range" min={DIRECT.min} max={DIRECT.max} step={DIRECT.step} value={direct} onChange={(e) => setDirect(Number(e.target.value))} style={{ ["--p" as string]: `${((direct - DIRECT.min) / (DIRECT.max - DIRECT.min)) * 100}%` }} />
        </label>

        <fieldset className="calc-field">
          <legend>Management fee</legend>
          <div className="calc-seg">
            {MANAGEMENT_FEES.map((f) => (
              <button key={f} type="button" aria-pressed={fee === f} onClick={() => setFee(f)}>
                {fee === f && <motion.i layoutId={`${uid}-fee`} className="calc-seg-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span>{f}%</span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="calc-result" aria-live="polite">
        {result && rates ? (
          <>
            <p className="calc-kicker">You could keep about</p>
            <p className="calc-big">£<RollingNumber value={result.monthly} /><span className="calc-unit"> a month</span></p>
            <p className="calc-year">£<RollingNumber value={result.owner} /> a year, from {result.nights} nights at {gbp(result.rate)}</p>

            <div className="calc-bar" aria-hidden>
              <motion.i className="own" animate={{ width: share(result.owner) }} transition={{ duration: reduce ? 0 : 0.5, ease: [0.2, 0.7, 0.2, 1] }} />
              <motion.i className="mgmt" animate={{ width: share(result.management) }} transition={{ duration: reduce ? 0 : 0.5, ease: [0.2, 0.7, 0.2, 1] }} />
              <motion.i className="plat" animate={{ width: share(result.platform) }} transition={{ duration: reduce ? 0 : 0.5, ease: [0.2, 0.7, 0.2, 1] }} />
            </div>
            <dl className="calc-lines">
              <div><dt>Booking income</dt><dd>{gbp(result.gross)}</dd></div>
              <div><dt><i className="plat" />Platform fees ({PLATFORM_FEE}% on {100 - direct}% of nights)</dt><dd>−{gbp(result.platform)}</dd></div>
              <div><dt><i className="mgmt" />Recharge management ({fee}%)</dt><dd>−{gbp(result.management)}</dd></div>
              <div className="total"><dt><i className="own" />To you, each year</dt><dd>{gbp(result.owner)}</dd></div>
            </dl>
            <p className="calc-basis"><Info size={14} /> {rates.basis} Before cleaning, VAT on the fee and your own costs such as mortgage and insurance.</p>

            <div className="calc-cta">
              <div>
                <strong>Want a professional estimate?</strong>
                <span>Our team prices your actual home with live market data, comparable homes and local events. Free, with no obligation.</span>
              </div>
              <a className="btn btn-mint" href="#estimate">Get my free estimate <ArrowRight size={18} /></a>
            </div>
          </>
        ) : (
          <p className="calc-kicker">Choose an area and the number of bedrooms.</p>
        )}
      </div>
    </div>
  );
}
