// ------------------------------------------------------------
// Shipping Policy.
// ------------------------------------------------------------

import styles from '../../styles/info.module.css';

export const metadata = { title: 'Shipping Policy — Libaas' };

export default function ShippingPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1>Shipping Policy</h1>

      <h2>Dispatch time</h2>
      <p>Orders are packed and dispatched within 24–48 hours of placement.</p>

      <h2>Delivery time</h2>
      <p>
        Delivery takes 3–5 working days in most cities. Remote areas may take
        up to 7 working days.
      </p>

      <h2>Shipping charges</h2>
      <ul>
        <li>Flat Rs. 250 per order</li>
        <li>FREE on all orders over Rs. 3,000</li>
      </ul>

      <h2>Coverage</h2>
      <p>We deliver nationwide across Pakistan via trusted courier partners.</p>

      <h2>Tracking</h2>
      <p>
        Once your order ships, you can follow its status on our Track Order
        page using your order number and checkout phone number.
      </p>
    </div>
  );
}
