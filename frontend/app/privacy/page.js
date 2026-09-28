// ------------------------------------------------------------
// Privacy Policy.
// ------------------------------------------------------------

import styles from '../../styles/info.module.css';

export const metadata = { title: 'Privacy Policy — Libaas' };

export default function PrivacyPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1>Privacy Policy</h1>
      <p>Last updated: September 2026</p>

      <h2>What we collect</h2>
      <ul>
        <li>Contact details you give us: name, phone, email, address.</li>
        <li>Order details: what you bought and when.</li>
        <li>Basic technical data: device and browser type, for improving the site.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To process and deliver your orders.</li>
        <li>To contact you about order updates.</li>
        <li>To send offers, only if you joined our newsletter.</li>
      </ul>

      <h2>What we never do</h2>
      <p>
        We never sell your personal information. Payment is cash on delivery,
        so we never see or store your bank or card details.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us to update or delete your account data at any time by
        writing to care@libaas.example.
      </p>
    </div>
  );
}
