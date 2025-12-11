// src/app/cart/page.tsx
"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totals, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const hasItems = items.length > 0;

  return (
    <section className="cart-page">
      <h1>Your Cart</h1>

      {!hasItems && <p>Your cart is currently empty.</p>}

      {hasItems && (
        <>
          <ul className="cart-items">
            {items.map((item) => (
              <li key={item.productId} className="cart-item">
                <div className="cart-item-main">
                  {item.imageUrl && (
                    // You can swap this to next/image later if you want
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  )}
                  <div className="cart-item-details">
                    <h2>{item.name}</h2>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <label>
                      Quantity:{" "}
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity({
                            productId: item.productId,
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <p>Line total: ${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p>Total items: {totals.itemCount}</p>
            <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>

            {/* Later this will go to an order/inquiry checkout page */}
            <button type="button" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </section>
  );
}
