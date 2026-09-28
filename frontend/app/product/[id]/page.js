'use client';

// ------------------------------------------------------------
// Product detail page — image gallery with thumbnails, price +
// old price + % OFF, size buttons, color dots, quantity stepper,
// Add to Cart + Buy Now, wishlist heart, delivery info,
// accordions (details, fabric & care, shipping & returns), SKU.
// ------------------------------------------------------------

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, formatPrice } from '../../../lib/api';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { categoryLabel } from '../../../lib/categories';
import styles from '../../../styles/product.module.css';

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.acc}>
      <button className={styles.accHead} onClick={() => setOpen((v) => !v)}>
        {title}
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className={styles.accBody}>{children}</div>}
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggle, isWished } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState('');

  useEffect(() => {
    async function load() {
      const data = await getProduct(id);
      setProduct(data);
      setLoading(false);
      if (data?.sizes?.length === 1) setSize(data.sizes[0]);
      if (data?.colors?.length === 1) setColor(data.colors[0]);
    }
    load();
  }, [id]);

  if (loading) {
    return <p className="container section">Loading product…</p>;
  }

  if (!product) {
    return (
      <div className="container section">
        <h1>Product not found</h1>
        <p>This item may have been removed.</p>
      </div>
    );
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const offPct = hasDiscount
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const needsSize = product.sizes?.length > 1;
  const wished = isWished(product);
  const images =
    product.images?.length > 0
      ? product.images
      : ['https://placehold.co/600x800?text=Libaas'];

  function readyToBuy() {
    if (needsSize && !size) {
      setSizeError('Please choose a size first.');
      return false;
    }
    setSizeError('');
    return true;
  }

  function handleAdd() {
    if (!readyToBuy()) return;
    addToCart(product, size, qty);
  }

  function handleBuyNow() {
    if (!readyToBuy()) return;
    addToCart(product, size, qty);
    router.push('/checkout');
  }

  return (
    <div className={`container section ${styles.wrap}`}>
      {/* Gallery */}
      <div className={styles.gallery}>
        <div className={styles.mainWrap}>
          <img
            className={styles.mainImg}
            src={images[activeImg]}
            alt={product.name}
          />
          {hasDiscount && (
            <span className={styles.badgeOff}>{offPct}% OFF</span>
          )}
        </div>
        {images.length > 1 && (
          <div className={styles.thumbs}>
            {images.map((src, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === activeImg ? styles.active : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <div>
            {product.isNew && <span className={styles.badgeNew}>NEW</span>}
            <h1>{product.name}</h1>
          </div>
          <button
            className={`${styles.heart} ${wished ? styles.active : ''}`}
            onClick={() => toggle(product)}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wished ? '♥' : '♡'}
          </button>
        </div>

        <p className={styles.cat}>{categoryLabel(product.category)}</p>

        <div className={styles.prices}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {hasDiscount && (
            <>
              <span className={styles.old}>{formatPrice(product.oldPrice)}</span>
              <span className={styles.save}>Save {offPct}%</span>
            </>
          )}
        </div>

        {product.rating > 0 && (
          <p className={styles.rating}>
            {'★'.repeat(Math.round(product.rating))} {product.rating.toFixed(1)} / 5
          </p>
        )}

        <p className={styles.desc}>{product.description}</p>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className={styles.colors}>
            <p>
              <strong>Color{color ? `: ${color}` : ''}</strong>
            </p>
            <div className={styles.colorRow}>
              {product.colors.map((c) => (
                <button
                  key={c}
                  className={`${styles.colorDot} ${color === c ? styles.selected : ''}`}
                  onClick={() => setColor(c)}
                  title={c}
                  aria-label={`Color ${c}`}
                >
                  {c[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className={styles.sizes}>
            <p>
              <strong>Size:</strong>
            </p>
            <div className={styles.sizeRow}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`${styles.sizeBtn} ${size === s ? styles.selected : ''}`}
                  onClick={() => {
                    setSize(s);
                    setSizeError('');
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            {sizeError && <p className="form-error">{sizeError}</p>}
          </div>
        )}

        {/* Qty + Add + Buy now */}
        <div className={styles.buyRow}>
          <div className={styles.qty}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span>{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button className="btn btn-outline" onClick={handleAdd}>
            Add to Cart
          </button>
          <button className="btn btn-primary" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>

        <p className={styles.stock}>
          {product.stock > 0
            ? `✓ In stock${product.stock <= 10 ? ` — only ${product.stock} left` : ''}`
            : 'Out of stock'}
        </p>

        {/* Delivery info */}
        <div className={styles.delivery}>
          <h3>Delivery Information</h3>
          <ul>
            <li>💵 Cash on Delivery available nationwide</li>
            <li>🚚 Dispatch in 24–48 hours; delivery in 3–5 working days</li>
            <li>📦 Free delivery on orders over Rs. 3,000</li>
          </ul>
        </div>

        {/* Accordions */}
        <Accordion title="Product Details">
          <p>{product.description}</p>
          {product.sku && (
            <p>
              <strong>SKU:</strong> {product.sku}
            </p>
          )}
        </Accordion>

        <Accordion title="Fabric & Care">
          {product.fabric && (
            <p>
              <strong>Fabric:</strong> {product.fabric}
            </p>
          )}
          <p>{product.care || 'Machine wash cold with like colours. Do not bleach.'}</p>
        </Accordion>

        <Accordion title="Shipping & Returns">
          <p>
            Orders are dispatched within 24–48 hours and delivered in 3–5
            working days across Pakistan. Unworn items in original condition
            can be exchanged within 7 days of delivery.
          </p>
        </Accordion>
      </div>
    </div>
  );
}
