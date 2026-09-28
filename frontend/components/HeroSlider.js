'use client';

// ------------------------------------------------------------
// HeroSlider — full-width banners with auto-slide, arrows and
// dots. Pauses while the mouse hovers over it.
// Banner images are placeholders; swap with real campaign art.
// ------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/HeroSlider.module.css';

const SLIDES = [
  {
    title: 'Winter Festive Edit',
    text: 'Rich embroideries and warm fabrics — up to 30% off.',
    cta: 'Shop Festive',
    href: '/shop?category=pret-festive',
    image: 'https://placehold.co/1400x520/7a1f2b/ffffff?text=Winter+Festive+Edit',
  },
  {
    title: 'New Lawn Arrivals',
    text: 'Fresh prints for the new season, starting Rs. 1,899.',
    cta: 'Shop Unstitched',
    href: '/shop?category=unstitched-lawn',
    image: 'https://placehold.co/1400x520/c9a24b/3a2c14?text=New+Lawn+Arrivals',
  },
  {
    title: 'The Fragrance Collection',
    text: 'Oud, florals and everything in between.',
    cta: 'Shop Fragrances',
    href: '/shop?category=fragrance-men',
    image: 'https://placehold.co/1400x520/2f3a4a/ffffff?text=Fragrance+Collection',
  },
  {
    title: 'Accessories That Finish the Look',
    text: 'Bags, jewelry, shawls and more.',
    cta: 'Shop Accessories',
    href: '/shop?category=acc-bags',
    image: 'https://placehold.co/1400x520/5c4a3a/ffffff?text=Accessories+Edit',
  },
];

const AUTO_MS = 3000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const go = useCallback((next) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance, skipped while paused
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => go(index + 1), AUTO_MS);
    return () => clearInterval(timer.current);
  }, [index, paused, go]);

  return (
    <div
      className={styles.slider}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={styles.track}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.title} className={styles.slide}>
            <img src={slide.image} alt={slide.title} />
            <div className={styles.caption}>
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
              <Link href={slide.href} className="btn btn-primary">
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => go(index - 1)}
        aria-label="Previous banner"
      >
        ‹
      </button>
      <button
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => go(index + 1)}
        aria-label="Next banner"
      >
        ›
      </button>

      <div className={styles.dots}>
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            className={`${styles.dot} ${i === index ? styles.active : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
