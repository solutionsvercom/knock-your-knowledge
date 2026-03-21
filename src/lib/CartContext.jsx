import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "kyk_cart_v1";

/**
 * @typedef {{ type: 'course' | 'bundle'; id: string; title: string; price: number; thumbnail?: string }} CartItem
 */

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((/** @type {CartItem} */ item) => {
    const key = `${item.type}:${item.id}`;
    setItems((prev) => {
      const next = prev.filter((x) => `${x.type}:${x.id}` !== key);
      next.push({ ...item, price: Number(item.price) || 0 });
      return next;
    });
  }, []);

  const removeItem = useCallback((type, id) => {
    setItems((prev) => prev.filter((x) => !(x.type === type && x.id === id)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((s, x) => s + (Number(x.price) || 0), 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clear,
      total,
      count: items.length,
    }),
    [items, addItem, removeItem, clear, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
