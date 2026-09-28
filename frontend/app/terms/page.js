// ------------------------------------------------------------
// Terms & Conditions.
// ------------------------------------------------------------

import styles from '../../styles/info.module.css';

export const metadata = { title: 'Terms & Conditions — Libaas' };

export default function TermsPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1>Terms & Conditions</h1>

      <h2>Orders</h2>
      <p>
        All orders are confirmed by phone or SMS before dispatch. We may
        cancel an order if the item is out of stock or the delivery address
        cannot be served — in that case you owe us nothing.
      </p>

      <h2>Pricing</h2>
      <p>
        Prices are listed in Pakistani Rupees and include all taxes. If a
        price is displayed incorrectly, we will inform you before dispatch
        and you may cancel.
      </p>

      <h2>Payment</h2>
      <p>
        We currently accept Cash on Delivery only. Please have the exact
        order total ready when your parcel arrives.
      </p>

      <h2>Product images</h2>
      <p>
        We photograph every product carefully, but slight colour differences
        can occur due to lighting and screen settings.
      </p>

      <h2>Accounts</h2>
      <p>
        You are responsible for keeping your account password private. Tell
        us immediately if you suspect misuse.
      </p>
    </div>
  );
}
