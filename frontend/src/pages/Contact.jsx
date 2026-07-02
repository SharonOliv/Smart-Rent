import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">Contact</span>
      <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Get in touch</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Questions, feedback, or partnership ideas &mdash; we'd love to hear from you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 text-brass" />
            <div>
              <p className="font-semibold text-ink">Email</p>
              <a href="mailto:support@smartrent.com" className="text-sm text-ink-soft hover:text-ink">support@smartrent.com</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 text-brass" />
            <div>
              <p className="font-semibold text-ink">Phone</p>
              <a href="tel:+18005557368" className="text-sm text-ink-soft hover:text-ink">+1-800-555-RENT</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 text-brass" />
            <div>
              <p className="font-semibold text-ink">Office</p>
              <p className="text-sm text-ink-soft">123 Rent St., Apartment City</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
          {submitted ? (
            <Alert kind="success">Thanks &mdash; your message has been sent. We'll get back to you soon.</Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name">
                  <input className={inputClasses} required />
                </Field>
                <Field label="Your email">
                  <input type="email" className={inputClasses} required />
                </Field>
              </div>
              <Field label="Message">
                <textarea rows={5} className={inputClasses} required />
              </Field>
              <Button type="submit" variant="primary">Send message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
