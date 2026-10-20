import { Check } from "lucide-react";
import { Reveal } from "./Reveal";

export function OwnerPlans() {
  return (
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
  );
}
