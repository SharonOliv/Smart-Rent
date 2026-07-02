import { useState } from "react";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";

const ReportIssue = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-16 sm:px-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">Support</span>
      <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Report an issue</h1>
      <p className="mt-2 text-ink-soft">Let us know what went wrong &mdash; we're here to help.</p>

      <div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        {submitted ? (
          <Alert kind="success">Thanks &mdash; your report has been submitted.</Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Your name">
              <input className={inputClasses} required />
            </Field>
            <Field label="Your email">
              <input type="email" className={inputClasses} required />
            </Field>
            <Field label="Issue type">
              <select className={inputClasses} required defaultValue="">
                <option value="" disabled>Select an issue type</option>
                <option value="login">Login issues</option>
                <option value="payment">Payment problems</option>
                <option value="listing">Listing content issues</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Description">
              <textarea rows={5} className={inputClasses} required />
            </Field>
            <Button type="submit" variant="primary" className="w-full">Submit report</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportIssue;
