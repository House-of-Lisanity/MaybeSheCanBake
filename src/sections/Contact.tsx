"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <h2>Contact</h2>
      {submitted ? (
        <p className="thank-you">
          Thank you! Your message has been received. You’ll hear back within 1–2
          business days.
        </p>
      ) : (
        <>
          <p className="contact-subtext">
            Have a question or want to inquire about a custom order? Fill out
            the form below and I’ll get back to you soon.
          </p>
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
        </>
      )}
    </section>
  );
}
