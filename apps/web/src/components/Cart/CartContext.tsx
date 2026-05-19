"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@repo/db/data";

type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Store cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []); // runs once - when the page loads

  // Saves updated cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]); // runs when cart changes

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      // Compares existing item and new product added to cart
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...product, quantity: 1 }]; // add to cart with quantity of 1
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function updateQuantity(id: number, quantity: number): boolean {
      const item = cart.find((p) => p.id === id); // find item

      if (!item) return false; // do nothing

      const max = item.stock; // max quantity of a product

      const reachedMax = quantity > max; // check if user exceeds stock

      setCart((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          /*
            If too high → cap at max
            Else → allow value
            Never go below 1
          */
          return {
            ...p,
            quantity: reachedMax
              ? max
              : Math.max(1, quantity),
          };
        })
      );

      return reachedMax;
    }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}