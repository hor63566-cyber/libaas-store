'use client';

// ------------------------------------------------------------
// Contact Us — contact details + a simple message form.
// ------------------------------------------------------------

import { useState } from 'react';
import styles from '../../styles/info.module.css';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function submit(e) {
    e.preventDefault();
    if (form.name.trim() && form.message.trim()) setSent(true);
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1>Contact Us</h1>
      <p>
        Questions about an order, a size, or anything else? Reach out — we
        reply within one working day.
      </p>

      <h2>Reach us directly</h2>
      <ul>
        <li>📞 0800-12345 (Mon–Sat, 9am–6pm)</li>
        <li>✉️ care@libaas.example</li>
        <li>📍 Lahore, Pakistan</li>
      </ul>

      {sent ? (
        <div className={styles.ok}>
          <h2>✓ Message sent</h2>
          <p>Thank you! Our team will get back to you soon.</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          <div className="field">
            <label>Your Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
