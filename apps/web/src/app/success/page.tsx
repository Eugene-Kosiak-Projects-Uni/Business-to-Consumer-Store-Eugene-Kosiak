"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/Cart/CartContext";

export default function SuccessPage() {
  const params = useSearchParams();
  const { clearCart } = useCart();

  /*
  useEffect(() => {
    const sessionId = params.get("session_id");

    if (!sessionId) return;

    async function savePurchase() {
      try {
        await fetch("/api/purchase-from-stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        clearCart();
      } catch (err) {
        console.error("Failed to save purchase:", err);
      }
    }

    savePurchase();
  }, [params, clearCart]); 
  */
  useEffect(() => {
    const sessionId = params.get("session_id");

    if (!sessionId) return;

    async function savePurchase() {
      await fetch("/api/purchase-from-stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });
    }

    savePurchase();
  }, [params]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>
      <p>Processing your order...</p>
    </div>
  );
}