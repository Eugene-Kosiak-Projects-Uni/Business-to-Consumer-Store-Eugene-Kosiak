"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/Cart/CartContext";

export default function SuccessPage() {
  const params = useSearchParams();

  const { clearCart } = useCart();

  // Prevent duplicate purchase saves
  const hasSavedPurchase = useRef(false);

  useEffect(() => {
    const sessionId = params.get("session_id");

    // Stop duplicate execution
    if (!sessionId || hasSavedPurchase.current) {
      return;
    }

    hasSavedPurchase.current = true;

    async function savePurchase() {
      try {
        const res = await fetch(
          "/api/purchase-from-stripe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
            }),
          }
        );

        // Clear cart after successful purchase
        if (res.ok) {
          clearCart();
        }
      } catch (err) {
        console.error(
          "Failed to save purchase:",
          err
        );
      }
    }

    savePurchase();
  }, [params, clearCart]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">
        Payment Successful 🎉
      </h1>

      <p>Processing your order...</p>
    </div>
  );
}