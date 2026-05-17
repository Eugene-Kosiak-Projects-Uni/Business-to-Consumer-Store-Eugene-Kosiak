"use client";

import { useEffect, useState } from "react";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/purchase")
      .then((res) => res.json())
      .then(setPurchases);
  }, []);

  const removePurchase = async (id: number) => {
    const res = await fetch(`/api/purchase?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setPurchases((prev) => prev.filter((p) => p.id !== id));

      setMessage("Purchase removed successfully");
    } else {
      setMessage("Failed to remove purchase");
    }

    setTimeout(() => setMessage(null), 2500);
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>

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
          <div key={p.id} className="border p-4 mb-4 rounded relative">
            <p>
                <strong>Date:</strong>{" "}
                {new Date(p.date).toLocaleString()}
            </p>

            {/* REMOVE BUTTON (vertically centered on right) */}
            <button
                onClick={() => removePurchase(p.id)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm px-3 py-1 bg-red-500 text-white rounded"
            >
                Remove
            </button>

            <ul className="ml-4 list-disc mt-2">
                {p.items.map((item: any) => (
                <li key={item.productId}>
                    {item.title} × {item.quantity} (${item.price})
                </li>
                ))}
            </ul>

            <p className="mt-2 font-bold">Total: ${p.total}</p>
            </div>
        ))
      )}
    </div>
  );
}