'use client';

// ------------------------------------------------------------
// Checkout page — cash-on-delivery form, posts to /api/orders.
// ------------------------------------------------------------

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, formatPrice } from '../../lib/api';
import styles from '../../styles/checkout.module.css';

const SHIP_COST = 250;
const FREE_SHIP_OVER = 3000;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', postalCode: '' });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [apiError, setApiError] = useState('');

  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_OVER ? 0 : SHIP_COST;
  const total = subtotal + shipping;

  // Auto-fill delivery details for logged-in users
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        name: f.name || user.name || '',
        phone: f.phone || user.phone || '',
        address: f.address || user.address || '',
        city: f.city || user.city || '',
        postalCode: f.postalCode || '',
      }));
    }
  }, [user]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const next = {};

    if (form.name.trim().length < 3) next.name = 'Please enter your full name.';
    if (!/^[0-9+\-\s]{7,16}$/.test(form.phone.trim()))
      next.phone = 'Please enter a valid phone number.';
    if (form.address.trim().length < 8)
      next.address = 'Please enter your complete address.';
    if (form.city.trim().length < 2) next.city = 'Please enter your city.';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function placeOrder(e) {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setPlacing(true);
    try {
      const order = await createOrder({
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          size: i.size || '',
        })),
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim(),
        },
      });

      setOrderId(order.orderNumber || order._id);
      setOrderTotal(total);
      clearCart();
    } catch (err) {
      setApiError(err.message || 'Could not place the order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  // ---------- Success screen ----------
  if (orderId) {
    return (
      <div className={`container section ${styles.success}`}>
        <h1>🎉 Order placed!</h1>
        <p>
          Thank you! Your order <strong>{orderId}</strong> is confirmed.
        </p>
        <p>Pay {formatPrice(orderTotal)} in cash when your parcel arrives.</p>
        <Link href="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ---------- Empty cart guard ----------
  if (items.length === 0) {
    return (
      <div className={`container section ${styles.success}`}>
        <h1>Your bag is empty</h1>
        <p>Add something to your bag before checking out.</p>
        <Link href="/shop" className="btn btn-primary">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.wrap}>
        {/* COD form */}
        <form className={styles.form} onSubmit={placeOrder} noValidate>
          <h2>Delivery Details</h2>
          <p className={styles.codNote}>💵 Cash on Delivery — pay at your doorstep</p>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <div className="field">
            <label>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Ayesha Khan"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="field">
            <label>Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="e.g. 0300 1234567"
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          <div className="field">
            <label>Complete Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="House, street, area…"
            />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>

          <div className="field">
            <label>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder="e.g. Lahore"
            />
            {errors.city && <p className="form-error">{errors.city}</p>}
          </div>

          <div className="field">
            <label>Postal Code (optional)</label>
            <input
              type="text"
              value={form.postalCode}
              onChange={(e) => set('postalCode', e.target.value)}
              placeholder="e.g. 54000"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={placing}>
            {placing ? 'Placing order…' : `Place Order · ${formatPrice(total)}`}
          </button>
        </form>

        {/* Summary */}
        <aside className={styles.summary}>
          <h2>Your Items ({items.length})</h2>
          {items.map((i) => (
            <div key={i.key} className={styles.line}>
              <span>
                {i.name} {i.size && `(${i.size})`} × {i.qty}
              </span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
          <div className={styles.line}>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          <div className={`${styles.line} ${styles.total}`}>
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
