import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "procurement-cart-v1";

function loadCart() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useProcurementCart() {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((entry) => {
    setItems((prev) => {
      const key = `${entry.materialId}-${entry.ukuran}`;
      const idx = prev.findIndex(
        (line) =>
          line.materialId === entry.materialId && line.ukuran === entry.ukuran,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          qty: next[idx].qty + entry.qty,
          catatan: entry.catatan || next[idx].catatan,
        };
        return next;
      }
      return [...prev, { ...entry, cartId: crypto.randomUUID() }];
    });
  }, []);

  const updateQty = useCallback((cartId, qty) => {
    setItems((prev) =>
      prev
        .map((line) =>
          line.cartId === cartId ? { ...line, qty: Math.max(0, qty) } : line,
        )
        .filter((line) => line.qty > 0),
    );
  }, []);

  const removeItem = useCallback((cartId) => {
    setItems((prev) => prev.filter((line) => line.cartId !== cartId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const productCount = useMemo(
    () => items.reduce((sum, line) => sum + line.qty, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, line) => sum + (Number(line.hargaSatuan) || 0) * line.qty,
        0,
      ),
    [items],
  );

  const primaryVendor = items[0]?.vendor ?? null;

  return {
    items,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    productCount,
    subtotal,
    primaryVendor,
  };
}
