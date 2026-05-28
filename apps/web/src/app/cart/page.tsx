"use client";

import { useCart } from "@/components/Cart/CartContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  // Store cart data and actions
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  // Store state if checkout is complete
  const [checkedOut, setCheckedOut] = useState(false);
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
    // Send cart to backend
    const res = await fetch("/api/purchase", {
      method: "POST",
      body: JSON.stringify({ cart }),
    });

    // Success full checkout
    if (res.ok) {
      setCheckedOut(true);
      clearCart();
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (checkingAuth) {
    return <p className="p-10">Checking login...</p>;
  }

  if (checkedOut) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>
        <p>Mock checkout complete.</p>
        <Link href="/">Back to store</Link>
      </div>
    );
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
                      // Display Message of max quantity of item reached based on current stock
                      onClick={() => {
                        requestAnimationFrame(() => {
                          const nextQty = item.quantity + 1;
                          const reachedMax = updateQuantity(item.id, nextQty);

                          if (reachedMax) {
                            setMessage(`Max quantity of "${item.title}" has been reached`);

                            if (timeoutRef.current) clearTimeout(timeoutRef.current);

                            timeoutRef.current = setTimeout(() => setMessage(""), 3000);
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