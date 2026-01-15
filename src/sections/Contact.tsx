"use client";

import { useState } from "react";

// TEMP (market): show a static contact notice instead of the form
const MARKET_MODE = false;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (MARKET_MODE) {
    return (
      <section id="contact" className="contact-section">
        <h2>Contact</h2>

        <div className="contact-splash">
          <div className="contact-splash-inner">
            <p>
              Sorry — our contact form is temporarily unavailable. Please email
              Heaven directly at <strong>maybeshecanbake@gmail.com</strong> and
              she&apos;ll be happy to help.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json();

        const friendlyFallback =
          "Sorry — our contact form is temporarily unavailable. Please email Heaven directly at maybeshecanbake@gmail.com and she’ll be happy to help.";

        const rawError = data?.error ?? "";

        // If Resend returns a technical “domain not verified” message, hide it from users.
        if (rawError.toLowerCase().includes("domain is not verified")) {
          setError(friendlyFallback);
          return;
        }

        // Otherwise, show a general friendly message (avoid leaking technical details).
        setError(friendlyFallback);
        return;
      }

      setSubmitted(true);
    } catch {
      setError(
        "Sorry — our contact form is temporarily unavailable. Please email Heaven directly at maybeshecanbake@gmail.com and she’ll be happy to help."
      );
    }
  };

  return (
    <section id="contact" className="contact-section">
      <h2>Contact</h2>
      {submitted ? (
        <div className="contact-splash">
          <div className="contact-splash-inner">
            <h3>Response Submitted Successfully</h3>
            <p>
              Your request has been received. If you were placing an order,
              please note that requests are not confirmed until reviewed.
              You&apos;ll receive a response from us within 24 hours.
            </p>
            <p>
              You will also receive a confirmation email with a copy of what you
              sent, so you know it arrived safely.
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="contact-subtext">
            Have a question or want to inquire about a custom order? Fill out
            the form below and I will get back to you soon.
          </p>

          <div className={`contact-form-wrapper ${error ? "is-disabled" : ""}`}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email:
                <input
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Message:
                <textarea
                  required
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Send Message</button>
            </form>
            {error && (
              <div className="contact-error-overlay">
                <div className="contact-error-card">
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
