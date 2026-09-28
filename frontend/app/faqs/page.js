'use client';

// ------------------------------------------------------------
// FAQs — expandable questions and answers.
// ------------------------------------------------------------

import { useState } from 'react';
import styles from '../../styles/info.module.css';

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Add items to your bag, go to checkout, fill in your delivery details and place the order. Payment is cash on delivery — you pay when your parcel arrives.',
  },
  {
    q: 'What are the delivery charges?',
    a: 'Delivery is Rs. 250 per order, and completely FREE on orders over Rs. 3,000 — anywhere in Pakistan.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders are dispatched within 24–48 hours and usually delivered in 3–5 working days.',
  },
  {
    q: 'How can I track my order?',
    a: 'Go to the Track Order page and enter your order number (e.g. LB-482913) along with the phone number used at checkout.',
  },
  {
    q: 'What is your exchange policy?',
    a: 'Unworn items in original condition can be exchanged within 7 days of delivery. Sale items are final unless damaged or incorrect.',
  },
  {
    q: 'How do sizes run?',
    a: 'Our pret sizes follow standard Pakistani sizing: XS (bust 32"), S (34"), M (36"), L (38"), XL (40"). When in doubt, size up.',
  },
  {
    q: 'Do I need an account to order?',
    a: 'No — you can check out as a guest. Creating an account just makes checkout faster next time.',
  },
];

export default function FaqsPage() {
  const [open, setOpen] = useState(0);

  return (
    <div className={`container ${styles.page}`}>
      <h1>FAQs</h1>
      <p>Quick answers to the questions we hear most.</p>

      <div style={{ marginTop: 24 }}>
        {FAQS.map((f, i) => (
          <div key={f.q} className={styles.faq}>
            <button onClick={() => setOpen(open === i ? -1 : i)}>
              {f.q}
              <span>{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p>{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
