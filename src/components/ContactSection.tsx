import { Mail, Phone } from "lucide-react";
import { site } from "@/content/site";
import { EnquiryForm } from "./EnquiryForm";
import { Reveal } from "./Reveal";

export function ContactSection({ title = "Get in touch", lead = "Tell us about your property, or ask us anything about a stay. We will be in touch." }: { title?: string; lead?: string }) {
  return (
    <section className="section dark on-dark" id="contact">
      <div className="wrap contact">
        <Reveal>
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Contact</p>
            <h2 className="h2">{title}</h2>
            <p className="lead">{lead}</p>
          </div>
          <div className="contact-lines">
            <a href={site.phone.href}><span className="ic"><Phone size={20} /></span>{site.phone.display}</a>
            <a href={`mailto:${site.email}`}><span className="ic"><Mail size={20} /></span>{site.email}</a>
          </div>
        </Reveal>
        <Reveal delay={0.1}><EnquiryForm /></Reveal>
      </div>
    </section>
  );
}
