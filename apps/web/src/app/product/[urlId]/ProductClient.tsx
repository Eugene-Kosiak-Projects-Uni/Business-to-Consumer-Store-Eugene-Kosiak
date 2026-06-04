"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useCart } from "@/components/Cart/CartContext";
import { useRouter } from "next/navigation";
import type { Product } from "@prisma/client";

export default function ProductClient({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();

  const [popupMessage, setPopupMessage] = useState("");

  const { addToCart, cart } = useCart();

  const currentQuantity =
    cart.find((item) => item.id === product.id)?.quantity || 0;

  async function handleAddToCart() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();

    if (!data.loggedIn) {
      router.push("/login");
      return;
    }

    if (currentQuantity >= product.stock) {
      setPopupMessage("Max stock reached");

      setTimeout(() => {
        setPopupMessage("");
      }, 4000);

      return;
    }

    addToCart(product);

    setPopupMessage("Item added to cart");

    setTimeout(() => {
      setPopupMessage("");
    }, 4000);
  }

  const cleanedContent = product.content
    .replace(/^# .*$/m, "")
    .trim();

  return (
    <main className="w-full px-6 py-10">
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-black"
      >
        ← Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-[500px] object-cover rounded-2xl"
        />

        <div className="space-y-6 relative">
          {/* Popup */}
          {popupMessage && (
            <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md z-10">
              {popupMessage}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight">
            {product.title}
          </h1>

          {/* Rating + Stock row */}
          <div className="flex items-center gap-4 text-base">
            <div className="flex items-center gap-1 text-lg">
              <span className="text-yellow-500 text-xl">⭐</span>

              <span className="font-bold text-lg">
                {product.rating}
              </span>

              <span className="font-bold text-lg">
                / 5
              </span>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  product.stock > 10
                    ? "bg-green-100 text-green-700"
                    : product.stock > 0
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                ? `Low Stock (${product.stock})`
                : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <div className="text-4xl font-bold text-blue-600">
            ${product.price} AUD
          </div>

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-3 rounded-xl font-semibold transition-colors
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-90
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-14 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">
          Product Details
        </h2>

        <article
          className="prose max-w-none"
          data-test-id="product-markdown"
        >
          <ReactMarkdown>
            {cleanedContent}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}