'use client';

// ------------------------------------------------------------
// ProductCarousel — horizontally scrolling product row with
// arrow buttons. Used for New Arrivals on the homepage.
// ------------------------------------------------------------

import { useRef } from 'react';
import ProductCard from './ProductCard';
import styles from '../styles/carousel.module.css';

export default function ProductCarousel({ products }) {
  const row = useRef(null);

  function scrollBy(dir) {
    const el = row.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.arrow} ${styles.left}`}
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
      >
        ‹
      </button>

      <div className={styles.row} ref={row}>
        {products.map((p) => (
          <div key={p._id} className={styles.cell}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <button
        className={`${styles.arrow} ${styles.right}`}
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}
