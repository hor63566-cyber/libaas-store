'use client';

// ------------------------------------------------------------
// Footer — 4 columns: About, Customer Care links, Contact info,
// Newsletter + social icons. Bottom bar with payment badges.
// ------------------------------------------------------------

import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Footer.module.css';

const CARE_LINKS = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Track Your Order', href: '/track-order' },
  { label: 'Shipping Info', href: '/shipping-policy' },
  { label: 'Returns & Exchange', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

const SOCIALS = [
  { label: 'Facebook', icon: 'f', href: '#' },
  { label: 'Instagram', icon: '◈', href: '#' },
  { label: 'TikTok', icon: '♪', href: '#' },
  { label: 'YouTube', icon: '▶', href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  function subscribe(e) {
    e.preventDefault();
    if (/^\S+@\S+\.\S+$/.test(email.trim())) {
      setJoined(true);
      setEmail('');
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* About */}
        <div>
          <h3 className={styles.brand}>Libaas</h3>
          <p className={styles.blurb}>
            Everyday eastern wear and accessories — honest fabric, honest
            prices, delivered across Pakistan. Stitched with care, worn with
            pride.
          </p>
          <Link href="/about" className={styles.readMore}>
            Read more →
          </Link>
        </div>

        {/* Customer care */}
        <div>
          <h4>Customer Care</h4>
          <ul>
            {CARE_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4>Contact</h4>
          <ul className={styles.contact}>
            <li>📞 0800-12345 (Mon–Sat, 9am–6pm)</li>
            <li>✉️ care@libaas.example</li>
            <li>📍 Lahore, Pakistan</li>
          </ul>
        </div>

        {/* Newsletter + social */}
        <div>
          <h4>Newsletter</h4>
          <p>Get new arrivals and offers in your inbox.</p>
          {joined ? (
            <p className={styles.thanks}>✓ You are on the list. Welcome!</p>
          ) : (
            <form className={styles.newsletter} onSubmit={subscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                Join
              </button>
            </form>
          )}
          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} title={s.label} aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomRow}`}>
          <span>© {new Date().getFullYear()} Libaas. All rights reserved.</span>
          <span className={styles.payBadges}>
            <span className={styles.pay}>COD</span>
            <span className={styles.pay}>VISA</span>
            <span className={styles.pay}>MASTERCARD</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
