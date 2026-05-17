"use client";

import { useEffect, useState } from "react";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetch("/api/purchase")
      .then((res) => res.json())
      .then(setPurchases);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>

      {purchases.length === 0 ? (
        <p>No purchases yet</p>
      ) : (
        purchases.map((p: any) => (
          <div key={p.id} className="border p-4 mb-4 rounded">
            <p><strong>Date:</strong> {new Date(p.date).toLocaleString()}</p>

            <ul className="ml-4 list-disc">
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