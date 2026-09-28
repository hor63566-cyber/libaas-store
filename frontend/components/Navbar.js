'use client';

// ------------------------------------------------------------
// Navbar — announcement bar, logo, nav links, LIVE search bar
// with suggestion dropdown, and cart button.
// ------------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { getProducts, formatPrice } from '../lib/api';
import styles from '../styles/Navbar.module.css';

const NAV_LINKS = [
  { label: 'Women', href: '/shop?dept=women' },
  { label: 'Men', href: '/shop?dept=men' },
  { label: 'Accessories', href: '/shop?dept=accessories' },
  { label: 'Sale', href: '/shop?sale=1' },
];

export default function Navbar() {
  const { count, setDrawerOpen } = useCart();
  const { user, loading, logout } = useAuth();
  const { count: wishCount } = useWishlist();
  const router = useRouter();

  const [term, setTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [searching, setSearching] = useState(false);

  const searchBoxRef = useRef(null);
  const debounceRef = useRef(null);

  // ---------- Live suggestions (debounced) ----------
  useEffect(() => {
    clearTimeout(debounceRef.current);

    const q = term.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowDrop(false);
      setSearching(false);
      return;
    }

    setSearching(true);

    debounceRef.current = setTimeout(async () => {
      const results = await getProducts({ search: q });
      setSuggestions(results.slice(0, 6));
      setShowDrop(true);
      setSearching(false);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [term]);

  // ---------- Close dropdown on outside click ----------
  useEffect(() => {
    function onDocClick(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowDrop(false);
      }
    }

    function onEsc(e) {
      if (e.key === 'Escape') setShowDrop(false);
    }

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);

    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // ---------- Full search submit ----------
  function onSearch(e) {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    setShowDrop(false);
    setMenuOpen(false);
    router.push(`/shop?search=${encodeURIComponent(q)}`);
  }

  function goToProduct(id) {
    setShowDrop(false);
    setTerm('');
    router.push(`/product/${id}`);
  }

  return (
    <header className={styles.header}>
      {/* Announcement bar */}
      <div className={styles.announce}>
        Free nationwide delivery on orders over Rs. 3,000
      </div>

      <nav className={styles.nav}>
        <button
          className={styles.burger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <Link href="/" className={styles.logo}>
          Libaas
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Prominent live search */}
        <div className={styles.searchWrap} ref={searchBoxRef}>
          <form className={styles.search} onSubmit={onSearch}>
            <input
              type="text"
              placeholder="Search suits, kurtis, perfumes…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDrop(true);
              }}
              aria-label="Search products"
            />
            <button type="submit" aria-label="Search">
              🔍
            </button>
          </form>

          {showDrop && (
            <div className={styles.dropdown}>
              {searching && (
                <p className={styles.dropMsg}>Searching…</p>
              )}

              {!searching && suggestions.length === 0 && (
                <p className={styles.dropMsg}>
                  No products found for “{term.trim()}”.
                </p>
              )}

              {!searching &&
                suggestions.map((p) => (
                  <button
                    key={p._id}
                    className={styles.suggestion}
                    onClick={() => goToProduct(p.slug)}
                  >
                    <img
                      src={
                        p.images?.[0] ||
                        'https://placehold.co/100x130?text=Libaas'
                      }
                      alt={p.name}
                    />
                    <span className={styles.sugInfo}>
                      <span className={styles.sugName}>{p.name}</span>
                      <span className={styles.sugPrice}>
                        {formatPrice(p.price)}
                      </span>
                    </span>
                  </button>
                ))}

              {!searching && suggestions.length > 0 && (
                <button
                  className={styles.viewAll}
                  onClick={onSearch}
                >
                  View all results for “{term.trim()}” →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={styles.iconBtn}
          aria-label="Wishlist"
          title="Wishlist"
        >
          ♥
          {wishCount > 0 && <span className={styles.badge}>{wishCount}</span>}
        </Link>

        <button
          className={styles.cartBtn}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open cart"
        >
          🛒
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </button>

        {/* Auth — Login / Sign Up or logged-in name */}
        {!loading &&
          (user ? (
            <div className={styles.account}>
              <Link href="/wishlist" className={styles.userName} title="My account">
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button
                className={styles.authLink}
                onClick={logout}
                title="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.authBtn} title="Login or create an account">
              👤 Login / Sign Up
            </Link>
          ))}
      </nav>
    </header>
  );
}
