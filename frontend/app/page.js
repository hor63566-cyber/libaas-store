// ------------------------------------------------------------
// Homepage — hero slider, category/collection/fragrance/
// accessories tiles, new arrivals carousel, sale section.
// ------------------------------------------------------------

import Link from 'next/link';
import HeroSlider from '../components/HeroSlider';
import HomeSections from '../components/HomeSections';
import ProductCarousel from '../components/ProductCarousel';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/api';
import styles from '../styles/home.module.css';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // New arrivals: newest 10 (fails soft to [] if API is down)
  const all = await getProducts({ sort: 'newest' });
  const arrivals = all.filter((p) => p.isNew).slice(0, 10);
  const sale = all
    .filter((p) => p.oldPrice && p.oldPrice > p.price)
    .slice(0, 8);

  return (
    <>
      <HeroSlider />

      <HomeSections />

      {/* New arrivals carousel */}
      <section className="section" style={{ background: 'var(--bg-soft)' }}>
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-sub">Fresh drops, just landed</p>

          {arrivals.length === 0 ? (
            <p className={styles.empty}>
              New arrivals are loading — please make sure the backend is
              running.
            </p>
          ) : (
            <>
              <ProductCarousel products={arrivals} />
              <div className={styles.center}>
                <Link href="/shop?sort=newest" className="btn btn-outline">
                  View All
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Sale */}
      {sale.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Sale — Up to 30% Off</h2>
            <p className="section-sub">Discounted favourites, while stocks last</p>
            <div className={styles.grid}>
              {sale.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            <div className={styles.center}>
              <Link href="/shop?sale=1" className="btn btn-primary">
                Shop All Sale
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Simple trust strip */}
      <section className="section" style={{ background: 'var(--bg-soft)' }}>
        <div className={`container ${styles.trust}`}>
          <div>
            <h3>🚚 Nationwide Delivery</h3>
            <p>Free shipping on orders over Rs. 3,000</p>
          </div>
          <div>
            <h3>💵 Cash on Delivery</h3>
            <p>Pay at your doorstep, no advance needed</p>
          </div>
          <div>
            <h3>↩️ Easy Exchange</h3>
            <p>7-day exchange on unworn items</p>
          </div>
        </div>
      </section>
    </>
  );
}
