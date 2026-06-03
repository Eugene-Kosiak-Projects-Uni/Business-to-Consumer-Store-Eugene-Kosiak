"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Purchase item structure
type PurchaseItem = {
  productId: number;
  title: string;
  quantity: number;
  price: number;
};

// Purchase structure
type Purchase = {
  id: number;
  date: string;
  total: number;
  items: PurchaseItem[];
};

export default function PurchasesPage() {
  const router = useRouter();

  // Stores list of purchases - start empty
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // Stores feedback message (success/error) - null means no message
  const [message, setMessage] = useState<string | null>(null);

  // Stores loading state while purchases are fetched
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchases() {
      try {
        const res = await fetch("/api/purchase");

        // Redirect user if not logged in
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        // convert response to JSON
        const data = await res.json();

        // store its state ONLY if response is an array
        if (Array.isArray(data)) {
          setPurchases(data);
        } else {
          setPurchases([]);
        }
      } catch (error) {
        console.error(error);

        // fallback to empty array if request fails
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    }

    loadPurchases();
  }, [router]); // dependency array - runs once during page loading

  /* - New version - this works, but I think the original is more readable
  const removePurchase = async (id: number) => {
    // Calls API to delete
    const res = await fetch(`/api/purchase?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const refreshed = await fetch("/api/purchase").then((r) =>
        r.json()
      );

      setPurchases(refreshed);

      setMessage("Purchase removed successfully");
    } else {
      setMessage("Failed to remove purchase");
    }

    setTimeout(() => setMessage(null), 2500);
  };
  */

  const removePurchase = async (id: number) => {
    // Calls API to delete
    const res = await fetch(`/api/purchase?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Remove deleted item that matchs product id and api id
      setPurchases((prev) =>
        prev.filter((p) => p.id !== id)
      );

      setMessage("Purchase removed successfully");
    } else {
      setMessage("Failed to remove purchase");
    }

    setTimeout(() => setMessage(null), 2500);
  };

  // Loading screen while purchases are fetched
  if (loading) {
    return <p className="p-6">Loading purchases...</p>;
  }

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">
        Purchase History
      </h1>

      {/* Toast message (like cart max-qty UI) */}
      {message && (
        <div className="mb-4 p-3 rounded border bg-red-100 text-red-700">
          {message}
        </div>
      )}

      {purchases.length === 0 ? (
        <p>No purchases yet</p>
      ) : (
        purchases.map((p) => (
          <div
            key={p.id}
            data-test-id="purchase-item"
            data-purchase-id={p.id}
            className="border p-4 mb-4 rounded relative"
          >
            <p>
              <strong>Date:</strong>{" "}
              {new Date(p.date).toLocaleString()}
            </p>

            {/* REMOVE BUTTON */}
            <button
              onClick={() => removePurchase(p.id)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm px-3 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>

            <ul className="ml-4 list-disc mt-2">
              {p.items.map((item, index) => (
                <li key={`${item.productId}-${index}`}>
                  {item.title} × {item.quantity} (${item.price})
                </li>
              ))}
            </ul>

            <p className="mt-2 font-bold">
              Total: ${p.total}
            </p>
          </div>
        ))
      )}
    </div>
  );
}