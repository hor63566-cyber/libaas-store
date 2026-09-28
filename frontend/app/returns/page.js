// ------------------------------------------------------------
// Returns & Exchange Policy.
// ------------------------------------------------------------

import styles from '../../styles/info.module.css';

export const metadata = { title: 'Returns & Exchange — Libaas' };

export default function ReturnsPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1>Returns & Exchange</h1>

      <h2>7-day exchange</h2>
      <p>
        Unworn items in their original condition — with tags attached — can
        be exchanged within 7 days of delivery.
      </p>

      <h2>How to request</h2>
      <ul>
        <li>Contact us within 7 days with your order number.</li>
        <li>Keep the item unused, unwashed and in original packaging.</li>
        <li>We will arrange a pickup or guide you on dispatch.</li>
      </ul>

      <h2>Damaged or wrong items</h2>
      <p>
        If your parcel arrives damaged or contains the wrong item, tell us
        within 48 hours with a photo. We will replace it or refund you —
        your choice.
      </p>

      <h2>Sale items</h2>
      <p>
        Items bought on sale are final sale, unless they arrive damaged or
        incorrect.
      </p>

      <h2>Refunds</h2>
      <p>
        Since we operate on cash on delivery, refunds are issued via bank
        transfer or mobile wallet within 5–7 working days of receiving the
        returned item.
      </p>
    </div>
  );
}
