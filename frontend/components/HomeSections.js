// ------------------------------------------------------------
// HomeSections — Shop by Category (Unstitched + Pret), Shop by
// Collection, Fragrances and Accessories tiles on the homepage.
// Each tile shows a real product photo from that category
// (falls back to a soft tinted tile when nothing matches).
// ------------------------------------------------------------

import Link from 'next/link';
import {
  categoryLabel,
  UNSTITCHED_TILES,
  PRET_TILES,
  COLLECTION_TILES,
  FRAGRANCE_TILES,
  ACCESSORY_TILES,
} from '../lib/categories';
import styles from '../styles/HomeSections.module.css';

function tileImg(text, tint) {
  return `https://placehold.co/500x600/${tint}/5C4A3A?text=${encodeURIComponent(text)}`;
}

// First product photo found for a category (or any product as a
// last resort so no tile is ever an empty box).
function categoryPhoto(products, slug) {
  const match = products.find(
    (p) => p.category === slug && p.images && p.images.length > 0
  );
  if (match) return match.images[0];
  const any = products.find((p) => p.images && p.images.length > 0);
  return any ? any.images[0] : null;
}

function Tile({ slug, label, tint, photo }) {
  return (
    <Link
      href={`/shop?category=${slug}`}
      className={styles.card}
    >
      <img
        src={photo || tileImg(label, tint)}
        alt={label}
        loading="lazy"
      />
      <span className={styles.label}>{label}</span>
    </Link>
  );
}

function Section({ title, sub, children, wide }) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
        <div className={wide ? styles.gridWide : styles.grid}>{children}</div>
      </div>
    </section>
  );
}

export default function HomeSections({ products = [] }) {
  return (
    <>
      <Section title="Shop by Category" sub="Unstitched — pick your fabric">
        {UNSTITCHED_TILES.map((t) => (
          <Tile
            key={t.slug}
            slug={t.slug}
            label={categoryLabel(t.slug)}
            tint={t.tint}
            photo={categoryPhoto(products, t.slug)}
          />
        ))}
      </Section>

      <Section title="Ready to Wear" sub="Pret — stitched and ready">
        {PRET_TILES.map((t) => (
          <Tile
            key={t.slug}
            slug={t.slug}
            label={categoryLabel(t.slug)}
            tint={t.tint}
            photo={categoryPhoto(products, t.slug)}
          />
        ))}
      </Section>

      <Section title="Shop by Collection" sub="Curated edits">
        {COLLECTION_TILES.map((t) => (
          <Tile
            key={t.slug}
            slug={t.slug}
            label={categoryLabel(t.slug)}
            tint={t.tint}
            photo={categoryPhoto(products, t.slug)}
          />
        ))}
      </Section>

      <Section title="Fragrances" sub="Scents for him and her" wide>
        {FRAGRANCE_TILES.map((t) => (
          <Tile
            key={t.slug}
            slug={t.slug}
            label={t.label}
            tint={t.tint}
            photo={categoryPhoto(products, t.slug)}
          />
        ))}
      </Section>

      <Section title="Accessories" sub="Finishing touches">
        {ACCESSORY_TILES.map((slug) => (
          <Tile
            key={slug}
            slug={slug}
            label={categoryLabel(slug)}
            tint="EFE7DA"
            photo={categoryPhoto(products, slug)}
          />
        ))}
      </Section>
    </>
  );
}
