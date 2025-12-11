// src/context/CartContext.tsx
"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import {
  CartItem,
  CartTotals,
  AddToCartPayload,
  UpdateCartQuantityPayload,
} from "@/types/cart";

type CartContextValue = {
  items: CartItem[];
  totals: CartTotals;
  addToCart: (payload: AddToCartPayload) => void;
  updateQuantity: (payload: UpdateCartQuantityPayload) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totals: CartTotals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return { itemCount, subtotal };
  }, [items]);

  const addToCart = (payload: AddToCartPayload): void => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === payload.productId
      );

      const quantityToAdd = payload.quantity ?? 1;

      if (existingIndex === -1) {
        const newItem: CartItem = {
          productId: payload.productId,
          name: payload.name,
          price: payload.price,
          imageUrl: payload.imageUrl,
          quantity: quantityToAdd,
        };
        return [...prev, newItem];
      }

      const updated = [...prev];
      const existing = updated[existingIndex];
      updated[existingIndex] = {
        ...existing,
        quantity: existing.quantity + quantityToAdd,
      };
      return updated;
    });
  };

  const updateQuantity = (payload: UpdateCartQuantityPayload): void => {
    setItems((prev) => {
      const { productId, quantity } = payload;

      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId);
      }

      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (productId: string): void => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const value: CartContextValue = useMemo(
    () => ({
      items,
      totals,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (ctx === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
