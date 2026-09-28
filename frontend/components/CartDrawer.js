'use client';

// ------------------------------------------------------------
// CartDrawer — slide-in mini cart with qty controls.
// ------------------------------------------------------------

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/api';
import styles from '../styles/CartDrawer.module.css';

export default function CartDrawer() {
  const {
    items,
    subtotal,
    isDrawerOpen,
    setDrawerOpen,
    removeFromCart,
    updateQty,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <>
      <div
        className={styles.overlay}
        onClick={() => setDrawerOpen(false)}
      />

      <aside className={styles.drawer}>
        <div className={styles.head}>
          <h3>Your Bag ({items.length})</h3>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className={styles.items}>
          {items.length === 0 && (
            <p className={styles.empty}>Your bag is empty.</p>
          )}

          {items.map((item) => (
            <div key={item.key} className={styles.item}>
              <img src={item.image} alt={item.name} />

              <div className={styles.info}>
                <p className={styles.name}>{item.name}</p>
                {item.size && <p className={styles.size}>Size: {item.size}</p>}

                <div className={styles.qtyRow}>
                  <button onClick={() => updateQty(item.key, item.qty - 1)}>
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.key, item.qty + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className={styles.right}>
                <p>{formatPrice(item.price * item.qty)}</p>
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

        {items.length > 0 && (
          <div className={styles.foot}>
            <div className={styles.total}>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <Link
              href="/checkout"
              className="btn btn-primary"
              onClick={() => setDrawerOpen(false)}
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              className="btn btn-outline"
              onClick={() => setDrawerOpen(false)}
            >
              View Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
