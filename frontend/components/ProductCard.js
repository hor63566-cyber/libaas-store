'use client';

// ------------------------------------------------------------
// ProductCard — image, wishlist heart, NEW / % OFF badges,
// name, price, old price, rating.
// Used on the homepage, shop page and wishlist page.
// ------------------------------------------------------------

import Link from 'next/link';
import { formatPrice } from '../lib/api';
import { useWishlist } from '../context/WishlistContext';
import styles from '../styles/ProductCard.module.css';

export default function ProductCard({ product }) {
  const { toggle, isWished } = useWishlist();
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const wished = isWished(product);
  const offPct = hasDiscount
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  function onHeart(e) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  }

  return (
    <div className={styles.card}>
      <Link href={`/product/${product._id}`} className={styles.media}>
        <img
          src={product.images?.[0] || 'https://placehold.co/600x800?text=Libaas'}
          alt={product.name}
          loading="lazy"
        />
        <span className={styles.badges}>
          {product.isNew && <span className={styles.badgeNew}>NEW</span>}
          {hasDiscount && (
            <span className={styles.badgeOff}>{offPct}% OFF</span>
          )}
        </span>
      </Link>

      <button
        className={`${styles.heart} ${wished ? styles.active : ''}`}
        onClick={onHeart}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wished ? '♥' : '♡'}
      </button>

      <Link href={`/product/${product._id}`} className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.prices}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className={styles.old}>{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        {product.rating > 0 && (
          <div className={styles.rating}>
            {'★'.repeat(Math.round(product.rating))}
            <span> ({product.rating.toFixed(1)})</span>
          </div>
        )}
      </Link>
    </div>
  );
}
