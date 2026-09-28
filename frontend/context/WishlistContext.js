'use client';

// ------------------------------------------------------------
// WishlistContext — heart-saved products, kept in localStorage.
// Stores the full product snapshot so the wishlist page works
// offline from the API.
// ------------------------------------------------------------

import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'libaas-wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load saved wishlist once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Corrupt data — start fresh
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or unavailable — wishlist just won't persist
    }
  }, [items]);

  function toggle(product) {
    setItems((prev) => {
      const id = product._id || product.id;
      const exists = prev.some((p) => (p._id || p.id) === id);
      if (exists) return prev.filter((p) => (p._id || p.id) !== id);
      return [...prev, product];
    });
  }

  function isWished(product) {
    const id = product._id || product.id;
    return items.some((p) => (p._id || p.id) === id);
  }

  function remove(id) {
    setItems((prev) => prev.filter((p) => (p._id || p.id) !== id));
  }

  return (
    <WishlistContext.Provider
      value={{ items, count: items.length, toggle, isWished, remove }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
