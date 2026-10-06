import { useState } from "react";

// Paste the Web App URL you get after deploying the Google Apps Script.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyQnLYMBWhIbK7a8ewSNt7CVb-lNi_V5NPKBNRijHgZQs0HkNfDpoB3RCY0xHWDTD39mw/exec";

const DIETARY_OPTIONS = ["Halal", "Vegetarian (素食)", "None / Will Specify (无)"];

const initialForm = {
  name: "",
  pax: 1,
  dietary: "None / Will Specify",
  dietaryDetails: "",
};

export default function RSVPForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    try {
      // Sent as text/plain (no custom headers) so the browser doesn't
      // trigger a CORS preflight, which Apps Script can't answer.
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          pax: Number(form.pax),
          dietary: form.dietary,
          dietaryDetails: form.dietaryDetails.trim(),
        }),
      });

      const result = await res.json();
      if (!result.ok) throw new Error(result.error || "Something went wrong.");

      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err.message || "We couldn't send your RSVP. Please try again."
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rsvp" role="status">
        <style>{css}</style>
        <h2 className="rsvp-title">Thank you, {form.name.trim()}.</h2>
        <p>
          Your RSVP for {form.pax} {Number(form.pax) === 1 ? "guest" : "guests"}{" "}
          has been received. If you need to change anything, submit the form
          again with the same name and your earlier response will be updated.
        </p>
        <button
          type="button"
          className="rsvp-btn rsvp-btn-secondary"
          onClick={() => {
            setForm(initialForm);
            setStatus("idle");
          }}
        >
          Edit your response
        </button>
      </div>
    );
  }

  return (
    <form className="rsvp" onSubmit={handleSubmit}>
      <style>{css}</style>
      <h2 className="rsvp-title">RSVP</h2>

      <label className="rsvp-field">
        <span>Name (姓名)</span>
        <input
          type="text"
          value={form.name}
          onChange={update("name")}
          required
          maxLength={100}
          autoComplete="name"
        />
      </label>

      <label className="rsvp-field">
        <span>Pax (宾客人数)</span>
        <input
          type="number"
          value={form.pax}
          onChange={update("pax")}
          required
          min={1}
          max={20}
          step={1}
          inputMode="numeric"
        />
      </label>

      <label className="rsvp-field">
        <span>Dietary restrictions (饮食)</span>
        <select value={form.dietary} onChange={update("dietary")}>
          {DIETARY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="rsvp-field">
        <span>Dietary details (allergies, other requirements)</span>
        <textarea
          rows={3}
          value={form.dietaryDetails}
          onChange={update("dietaryDetails")}
          maxLength={500}
          placeholder="Leave blank if none"
        />
      </label>

      {status === "error" && (
        <p className="rsvp-error" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        className="rsvp-btn"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}

// Styles are scoped under .rsvp and use CSS variables, so you can theme the
// form from your site's stylesheet, e.g. .rsvp { --rsvp-accent: #2f5d50; }
const css = `
.rsvp {
  --rsvp-accent: #2f5d50;
  --rsvp-accent-text: #ffffff;
  --rsvp-border: #b9b9b9;
  --rsvp-error: #b3261e;
  max-width: 28rem;
  margin: 0 auto;
  padding: 1rem;
  font: inherit;
  color: inherit;
  box-sizing: border-box;
}
.rsvp *, .rsvp *::before, .rsvp *::after { box-sizing: inherit; }
.rsvp-title { margin: 0 0 1rem; }
.rsvp-field { display: block; margin-bottom: 1rem; }
.rsvp-field > span { display: block; margin-bottom: 0.35rem; font-weight: 600; }
.rsvp-field input,
.rsvp-field select,
.rsvp-field textarea {
  width: 100%;
  padding: 0.65rem 0.75rem;
  font: inherit;
  color: inherit;
  background: transparent;
  border: 1px solid var(--rsvp-border);
  border-radius: 6px;
}
.rsvp-field textarea { resize: vertical; }
.rsvp :is(input, select, textarea, button):focus-visible {
  outline: 3px solid var(--rsvp-accent);
  outline-offset: 2px;
}
.rsvp-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  font: inherit;
  font-weight: 600;
  color: var(--rsvp-accent-text);
  background: var(--rsvp-accent);
  border: 1px solid var(--rsvp-accent);
  border-radius: 6px;
  cursor: pointer;
}
.rsvp-btn:disabled { opacity: 0.6; cursor: wait; }
.rsvp-btn-secondary {
  margin-top: 0.5rem;
  color: inherit;
  background: transparent;
  border-color: var(--rsvp-border);
}
.rsvp-error { margin: 0 0 1rem; color: var(--rsvp-error); }
`;
