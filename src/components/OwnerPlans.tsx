import { Reveal } from "./Reveal";

// The two ways to work with Recharge, compared line by line.
const ROWS: [string, string, string][] = [
  ["How you are paid", "A fixed rent, the same every month", "Your booking income, less our fee and costs"],
  ["When the property is empty", "You are still paid in full", "No income for those nights"],
  ["Day to day", "We furnish, list, clean and maintain", "We price, list, clean, maintain and look after guests"],
  ["Pricing", "Not your concern: the rent is fixed", "Prices reviewed every day across the booking sites"],
  ["What you receive", "One fixed payment each month", "A monthly statement and payout from cleared funds"],
  ["Best if you want", "A steady, predictable income", "The most from your property"],
];

export function OwnerPlans() {
  return (
    <Reveal className="compare" >
      <div className="compare-row compare-top" role="row">
        <span aria-hidden />
        <div><small>Fixed income</small><strong>Guaranteed rent</strong></div>
        <div className="pick"><small>Short-let earnings</small><strong>Full management</strong></div>
      </div>
      {ROWS.map(([label, rent, managed]) => (
        <div key={label} className="compare-row" role="row">
          <span className="compare-label" role="rowheader">{label}</span>
          <span role="cell"><em>Guaranteed rent</em>{rent}</span>
          <span role="cell" className="pick"><em>Full management</em>{managed}</span>
        </div>
      ))}
    </Reveal>
  );
}
