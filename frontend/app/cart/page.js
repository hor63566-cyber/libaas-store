'use client';

// ------------------------------------------------------------
// Cart page — full bag view with qty controls and totals.
// ------------------------------------------------------------

import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/api';
import styles from '../../styles/cart.module.css';

const FREE_SHIP_OVER = 3000;
const SHIP_COST = 250;

export default function CartPage() {
  const { items, subtotal, updateQty, removeFromCart } = useCart();

  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_OVER ? 0 : SHIP_COST;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className={`container section ${styles.empty}`}>
        <h1>Your bag is empty</h1>
        <p>Looks like you haven&apos;t picked anything yet.</p>
        <Link href="/shop" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className={styles.title}>Shopping Bag</h1>

      <div className={styles.wrap}>
        {/* Items */}
        <div className={styles.items}>
          {items.map((item) => (
            <div key={item.key} className={styles.item}>
              <img src={item.image} alt={item.name} />

              <div className={styles.info}>
                <h3>{item.name}</h3>
                {item.size && <p className={styles.size}>Size: {item.size}</p>}
                <p className={styles.unit}>{formatPrice(item.price)} each</p>

                <div className={styles.qty}>
                  <button onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                </div>
              </div>

              <div className={styles.right}>
                <strong>{formatPrice(item.price * item.qty)}</strong>
                <button
                  className={styles.remove}
                  onClick={() => removeFromCart(item.key)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className={styles.summary}>
          <h2>Order Summary</h2>

          <div className={styles.row}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className={styles.row}>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className={styles.hint}>
              Add {formatPrice(FREE_SHIP_OVER - subtotal)} more for free delivery.
            </p>
          )}

          <div className={`${styles.row} ${styles.total}`}>
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <Link href="/checkout" className="btn btn-primary">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
