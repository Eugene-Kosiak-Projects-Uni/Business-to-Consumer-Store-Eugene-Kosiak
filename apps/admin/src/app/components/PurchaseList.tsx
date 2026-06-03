"use client";

import {
  Purchase,
  PurchaseItem,
  Product,
  User,
} from "@prisma/client";

import Link from "next/link";

type PurchaseItemWithProduct = PurchaseItem & {
  product: Product;
};

type PurchaseWithRelations = Purchase & {
  user: User;
  items: PurchaseItemWithProduct[];
};

export default function PurchaseList({
  purchases,
}: {
  purchases: PurchaseWithRelations[];
}) {
  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="admin-title text-4xl">
          Purchase Records
        </h1>

        <Link href="/">
          <button className="admin-btn">
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div className="space-y-6">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="border rounded-xl p-6 bg-white shadow-sm"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">
                  Purchase #{purchase.id}
                </h2>

                <p>
                  Customer: {purchase.user.name}
                </p>

                <p>
                  Email: {purchase.user.email}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  Total: ${purchase.total.toFixed(2)}
                </p>

                <p>
                  {new Date(purchase.date).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">
                Purchased Items
              </h3>

              <div className="space-y-3">
                {purchase.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />

                      <div>
                        <p className="font-medium">
                          {item.title}
                        </p>

                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>

                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold">
                      $
                      {(item.price * item.quantity).toFixed(
                        2
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}