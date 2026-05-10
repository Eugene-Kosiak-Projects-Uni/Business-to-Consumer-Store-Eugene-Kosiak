"use client";

import { useState } from "react";
import { products } from "@repo/db/data";
import { notFound } from "next/navigation";

export default function ProductPage({
  params,
}: {
  params: { urlId: string };
}) {
  const [showPopup, setShowPopup] = useState(false);

  const product = products.find(
    (p) => p.urlId === params.urlId
  );

  if (!product) {
    notFound();
  }

  function handleAddToCart() {
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        
        <img
          src={product.imageUrl}
          alt={product.title}
          className="rounded-xl w-full h-[500px] object-cover"
        />

        <div className="space-y-5 relative">
          
          {/* Popup */}
          {showPopup && (
            <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
              Item added to cart
            </div>
          )}

          <h1 className="text-4xl font-bold">
            {product.title}
          </h1>

          <p className="text-gray-600">
            {product.description}
          </p>

          <div className="text-3xl font-bold text-blue-600">
            ${product.price}
          </div>

          <div>
            ⭐ {product.rating} / 5
          </div>

          <div>
            Brand: {product.brand}
          </div>

          <div>
            Category: {product.category}
          </div>

          <div
            className={
              product.stock > 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {product.stock > 0
              ? `In Stock (${product.stock})`
              : "Out of Stock"}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Add To Cart
          </button>

          <div className="pt-6 border-t">
            <article className="prose max-w-none">
              {product.content}
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}