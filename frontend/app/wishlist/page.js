'use client';

// ------------------------------------------------------------
// Wishlist page — products saved with the heart icon.
// Stored in localStorage via WishlistContext.
// ------------------------------------------------------------

import Link from 'next/link';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard';
import styles from '../../styles/shop.module.css';

export default function WishlistPage() {
  const { items, remove } = useWishlist();

  return (
    <div className="container section">
      <h1 className={styles.title}>My Wishlist</h1>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Your wishlist is empty.</p>
          <p>Tap the heart on any product to save it here.</p>
          <Link href="/shop" className="btn btn-primary">
            Discover Products
          </Link>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            {items.length} saved item{items.length === 1 ? '' : 's'}
          </p>
          <div className={styles.grid}>
            {items.map((p) => (
              <div key={p._id || p.id} className={styles.wishCell}>
                <ProductCard product={p} />
                <button
                  className="btn btn-outline"
                  onClick={() => remove(p._id || p.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
