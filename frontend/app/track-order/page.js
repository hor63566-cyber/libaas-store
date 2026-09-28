'use client';

// ------------------------------------------------------------
// Track Order — enter order number + checkout phone number to
// see the order status.
// ------------------------------------------------------------

import { useState } from 'react';
import { trackOrder, formatPrice } from '../../lib/api';
import styles from '../../styles/info.module.css';

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setError('Please enter both your order number and phone number.');
      return;
    }

    setBusy(true);
    try {
      const data = await trackOrder(orderNumber.trim(), phone.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not find this order.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1>Track Your Order</h1>
      <p>
        Enter the order number from your confirmation (e.g. LB-482913) and
        the phone number you used at checkout.
      </p>

      <form className={styles.trackForm} onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Order number (LB-______)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Checking…' : 'Track'}
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {result && (
        <div className={styles.result}>
          <h2>Order {result.orderNumber}</h2>
          <span className={`${styles.statusPill} ${styles[result.status] || ''}`}>
            {STATUS_LABELS[result.status] || result.status}
          </span>
          <p>
            Placed on{' '}
            {new Date(result.createdAt).toLocaleDateString('en-PK', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}{' '}
            · Delivery to {result.city} · Total{' '}
            {formatPrice(result.total)} (COD)
          </p>
          <ul>
            {result.items.map((item, i) => (
              <li key={i}>
                <span>
                  {item.name} {item.size && `(${item.size})`} × {item.qty}
                </span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
