"use client";

import { useCart } from "@/components/Cart/CartContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

export default function CartPage() {
  const router = useRouter();
  // Store cart data and actions
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  // Store max quantity message
  const [message, setMessage] = useState("");
  // Store if the user is logged in
  const [checkingAuth, setCheckingAuth] = useState(true);
  // Stores timeout ID for clearing messages - to prevent overlap timers
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if the user is logged in
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.loggedIn) {
          router.push("/login");
          return;
        }

        setCheckingAuth(false);
      } catch {
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]); // runs once when the page is loaded

  async function handleCheckout() {
    try {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      if (!stripe) {
        console.error("Stripe failed to load");
        return;
      }

      const body = {
        products: cart,
      };

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await res.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (checkingAuth) {
    return <p className="p-10">Checking login...</p>;
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {/* MAX QUANTITY MESSAGE */}
      {message && (
        <div
          data-test-id="max-qty-message"
          className="mb-4 p-2 bg-red-100 text-red-700 rounded"
        >
          {message}
        </div>
      )}

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border p-4 mb-2 gap-4"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-32 h-32 object-contain rounded-lg shadow-sm"
                />

                <div>
                  <p className="font-semibold">{item.title}</p>

                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} each × {item.quantity}
                  </p>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        requestAnimationFrame(() => {
                          const nextQty = item.quantity + 1;
                          const reachedMax = updateQuantity(item.id, nextQty);

                          if (reachedMax) {
                            setMessage(
                              `Max quantity of "${item.title}" has been reached`
                            );

                            if (timeoutRef.current) {
                              clearTimeout(timeoutRef.current);
                            }

                            timeoutRef.current = setTimeout(
                              () => setMessage(""),
                              3000
                            );
                          }
                        });
                      }}
                      className="px-2 py-1 border rounded"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => {
                        const nextQty = item.quantity + 1;

                        const reachedMax = updateQuantity(item.id, nextQty);

                        if (reachedMax) {
                          setMessage(
                            `Max quantity of "${item.title}" has been reached`
                          );

                          if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                          }

                          timeoutRef.current = setTimeout(() => {
                            setMessage("");
                          }, 3000);
                        }
                      }}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 font-bold text-xl">
            Total: ${total.toFixed(2)}
          </div>

          <button
            onClick={handleCheckout}
            className="mt-4 px-4 py-2 rounded font-semibold 
            bg-black text-white 
            dark:bg-white dark:text-black 
            hover:opacity-90 transition"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}