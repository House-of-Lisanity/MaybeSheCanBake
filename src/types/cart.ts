// src/types/cart.ts

export type CartItem = {
  productId: string;
  name: string;
  price: number; // single-unit price
  imageUrl?: string;
  quantity: number;
};

export type CartTotals = {
  itemCount: number;
  subtotal: number;
};

export type AddToCartPayload = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity?: number;
};

export type UpdateCartQuantityPayload = {
  productId: string;
  quantity: number;
};
