"use client";

import { useState, use } from "react";
import { products } from "@repo/db/data";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useCart } from "@/components/Cart/CartContext";

export default function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = use(params);

  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useCart();

  const product = products.find(
    (p) => p.urlId === urlId
  );

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        Product not found
      </div>
    );
  }

  function handleAddToCart() {
    addToCart(product!);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      {/* Back Button */}
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-black"
      >
        ← Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">

        {/* Product Image */}
        <div>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-[500px] object-cover rounded-2xl shadow-sm"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-5 relative">

          {/* Popup */}
          {showPopup && (
            <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
              Item added to cart
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{product.category}</span>

            <span>•</span>

            <span>
              ⭐ {product.rating}
            </span>
          </div>

          <h1 className="text-4xl font-bold">
            {product.title}
          </h1>

          <p className="text-gray-600 text-lg">
            {product.description}
          </p>

          <div className="text-4xl font-bold text-blue-600">
            ${product.price} AUD
          </div>

          <div className="space-y-2 text-sm">

            <p>
              <span className="font-medium">
                Brand:
              </span>{" "}
              {product.brand}
            </p>

            <p>
              <span className="font-medium">
                Stock:
              </span>{" "}
              <span
                className={
                  product.stock > 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {product.stock > 0
                  ? `${product.stock} Available`
                  : "Out of Stock"}
              </span>
            </p>

            <p>
              <span className="font-medium">
                Tags:
              </span>{" "}
              {product.tags}
            </p>
          </div>

          {/* Add To Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Add To Cart
          </button>

        </div>
      </div>

      {/* Product Content */}
      <div className="mt-14 border-t pt-10">

        <h2 className="text-2xl font-bold mb-6">
          Product Details
        </h2>

        <article className="prose prose-lg max-w-none">
          <ReactMarkdown>
            {product.content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}