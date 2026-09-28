'use client';

// ------------------------------------------------------------
// CartContext — global shopping cart state.
// Stored in memory + localStorage so the cart survives refresh.
// ------------------------------------------------------------

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'libaas-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Load saved cart once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // Corrupt storage — start fresh
      setItems([]);
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or unavailable — ignore
    }
  }, [items]);

  // ---------- Cart helpers ----------

  function addToCart(product, size = '', qty = 1) {
    const key = `${product._id}__${size}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);

      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + qty } : i
        );
      }

      return [
        ...prev,
        {
          key,
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          size,
          qty,
        },
      ];
    });

    setDrawerOpen(true);
  }

  function removeFromCart(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function updateQty(key, qty) {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;

    for (const item of items) {
      count += item.qty;
      subtotal += item.qty * item.price;
    }

    return { count, subtotal };
  }, [items]);

  const value = {
    items,
    count,
    subtotal,
    isDrawerOpen,
    setDrawerOpen,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
