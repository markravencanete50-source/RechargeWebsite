import type { Metadata } from "next";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ReportProblem } from "@/components/ReportProblem";
import { Reveal } from "@/components/Reveal";
import { RowList } from "@/components/RowList";
import { Situations } from "@/components/Situations";
import { SubNav } from "@/components/SubNav";
import { getCatalog } from "@/content/catalog";
import { heading } from "@/content/home-utils";
import { showcase } from "@/content/showcase";
import { site } from "@/content/site";
import { houseRules } from "@/content/stay";
import { breadcrumbs, graph } from "@/lib/schema";

const path = "/support/report-a-problem";

export const metadata: Metadata = {
  title: "Report a problem with a Recharge home",
  description: `For guests during a stay and for neighbours of a Recharge home. Tell us which home and what is wrong, and the team on duty replies. Urgent? Call ${site.phone.display} at any hour.`,
  alternates: { canonical: path },
};

export default async function ReportPage() {
  const { homes } = await getCatalog();
  const r = houseRules(homes);
  const faqs = [
    { q: "I am locked out. What do I do?", a: `Call ${site.phone.display} straight away. We talk you through access and arrange help if it is needed.` },
    { q: "Something in the home is broken. Who fixes it?", a: "Tell us and it becomes a repair job in the app. Urgent problems go straight to our maintenance team." },
    { q: "How quickly will someone reply?", a: "Messages are tracked with live response timers, so none waits unnoticed. For anything urgent, call us rather than messaging." },
    { q: "I live next door to a Recharge home. Who do I contact?", a: `Call ${site.phone.display} at any hour. Your concern is logged and passed to the team responsible for that home.` },
    { q: "Do I need to know which home it is?", a: "It helps, but you can still send a report without it. Give the street or the building in the details." },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbs([{ name: "Support", path: "/support" }, { name: "Report a problem", path }]))} />
      <PageHero photo={showcase.supportHero} eyebrow="Support" title="Report a problem" lead="Staying in one of our homes, or living next to one? Tell us which home and what is wrong. It goes straight to the team on duty, and they reply in the same window." />
      <SubNav section="/support" current={path} />

      <section className="section">
        <div className="wrap report-wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Three steps</p>
            <h2 className="h2">Tell us what is wrong</h2>
            <p className="lead">Choose who you are, the home and the problem. The chat opens with your report written out, and the team replies there.</p>
            <div className="urgent-line">
              <strong>Happening now, or urgent?</strong>
              <span>Call <a href={site.phone.href}>{site.phone.display}</a>, day or night. If anyone is in danger, call 999. If you smell gas, leave the home and call the gas emergency line on 0800 111 999.</span>
            </div>
          </Reveal>
          <ReportProblem homes={homes.map((h) => ({ slug: h.slug, title: heading(h), town: h.town }))} contact={{ phone: site.phone, email: site.email }} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="head-row">
            <Reveal><p className="eyebrow">Guests</p><h2 className="h2">What happens next</h2></Reveal>
            <Reveal delay={0.08}><p className="lead">The common problems during a stay, and what the team does about each one.</p></Reveal>
          </div>
          <Situations items={[
            { who: "Guests", situation: "I cannot get in", answer: `Call ${site.phone.display} straight away. We talk you through access and arrange help if it is needed.` },
            { who: "Guests", situation: "Something in the home is broken", answer: "Tell us and it becomes a repair job in the app. Urgent faults go straight to our maintenance team." },
            { who: "Guests", situation: "No heating or hot water", answer: "Call us. It is treated as urgent and goes straight to our maintenance team." },
            { who: "Guests", situation: "We are running low on supplies", answer: "Let us know what you need. Supplies that run low are tracked until they are replaced." },
            { who: "Guests", situation: "The wifi is not working", answer: "Message us with the home's name and the team looks into it. Your wifi details are in your check-in message." },
            { who: "Guests", situation: "I do not have my check-in details", answer: "Call or email us and we send the address and access instructions again." },
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="wrap split-sticky">
          <Reveal className="split-head">
            <p className="eyebrow">Neighbours</p>
            <h2 className="h2">Living next to one of our homes</h2>
            <p className="lead">{`${r.parties} of our ${r.total} homes list a rule of no parties or loud music, and we hold guests to it. If something is wrong, we want to know.`}</p>
          </Reveal>
          <RowList items={[
            { title: "Noise or a party", text: `Call ${site.phone.display} while it is happening. We contact the guests straight away.` },
            { title: "A door left open or a security worry", text: "Call us at any hour, and call 999 if anyone is in danger." },
            { title: "Parking, bins or anything else", text: "Send a report with the details. It is logged and passed to the team responsible for that home." },
            { title: "Every report is logged", text: "So a problem that happens again is seen, not forgotten." },
          ]} />
        </div>
      </section>

      <FaqSection items={faqs} title="Reporting a problem" eyebrow="Questions" tone="paper" />
    </>
  );
}
