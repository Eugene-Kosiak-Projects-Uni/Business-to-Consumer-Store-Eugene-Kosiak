/*
"use client";

import { useState, use } from "react";
import { products } from "@repo/db/data";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useCart } from "@/components/Cart/CartContext";
import { useRouter } from "next/navigation";

export default function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const router = useRouter();

  const { urlId } = use(params);
  // Store state of the pop up message
  const [popupMessage, setPopupMessage] = useState("");
  const { addToCart, cart } = useCart();

  // Find product based on their urlId
  const product = products.find((p) => p.urlId === urlId);

  if (!product) {
    return <div className="max-w-4xl mx-auto px-6 py-10">Product not found</div>;
  }

  // Variable for current Quantity the user wants, initially at 0
  const currentQuantity =
    cart.find((item) => item.id === product.id)?.quantity || 0;

  // Check if this is used at all:
  function getCookie(name: string) {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
  }

  async function handleAddToCart() {
    // Fetch login data
    const res = await fetch("/api/auth/me");
    const data = await res.json();

    // If data does not show that someone logged in then, redirect to login page
    if (!data.loggedIn) {
      router.push("/login");
      return;
    }

    if (!product) return; // Returns nothing if no product added to cart

    // Prevents buying more than what the product stock has
    if (currentQuantity >= product.stock) {
      setPopupMessage("Max stock reached");
      setTimeout(() => setPopupMessage(""), 4000);
      return;
    }

    addToCart(product);
    setPopupMessage("Item added to cart");

    setTimeout(() => setPopupMessage(""), 4000);
  }

  const cleanedContent = product.content.replace(/^# .*$/m, "").trim();

  return (
    <main className="w-full px-6 py-10">
      <Link href="/" className="text-sm text-gray-500 hover:text-black">
        ← Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-[500px] object-cover rounded-2xl"
        />

        <div className="space-y-5 relative">
          {popupMessage && (
            <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded-lg">
              {popupMessage}
            </div>
          )}

          <h1 className="text-4xl font-bold">{product.title}</h1>

          <p className="text-gray-600">{product.description}</p>

          <div className="text-4xl font-bold text-blue-600">
            ${product.price} AUD
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-3 rounded-xl font-semibold transition-colors
                      bg-black text-white
                      dark:bg-white dark:text-black
                      hover:opacity-90"
          >
            Add To Cart
          </button>
        </div>
      </div>

      <div className="mt-14 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">Product Details</h2>
        <article
          className="prose max-w-none"
          data-test-id="product-markdown"
        >
          <ReactMarkdown>{cleanedContent}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
*/

/* - Current
"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useCart } from "@/components/Cart/CartContext";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  urlId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  content: string;
};

export default function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const router = useRouter();
  const { urlId } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [popupMessage, setPopupMessage] = useState("");

  const { addToCart, cart } = useCart();

  const currentQuantity =
    cart.find((item) => item.id === product?.id)?.quantity || 0;

  useEffect(() => {
    async function loadProduct() {
      const res = await fetch(`/api/products/${urlId}`);
      if (!res.ok) return;

      const data = await res.json();
      setProduct(data);
    }

    loadProduct();
  }, [urlId]);

  async function handleAddToCart() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();

    if (!data.loggedIn) {
      router.push("/login");
      return;
    }

    if (!product) return;

    if (currentQuantity >= product.stock) {
      setPopupMessage("Max stock reached");
      setTimeout(() => setPopupMessage(""), 4000);
      return;
    }

    addToCart(product);
    setPopupMessage("Item added to cart");

    setTimeout(() => setPopupMessage(""), 4000);
  }

  if (!product) {
    return <div className="max-w-4xl mx-auto px-6 py-10">Product not found</div>;
  }

  const cleanedContent = product.content.replace(/^# .*$/m, "").trim();

  return (
    <main className="w-full px-6 py-10">
      <Link href="/" className="text-sm text-gray-500 hover:text-black">
        ← Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-[500px] object-cover rounded-2xl"
        />

        <div className="space-y-5 relative">
          {popupMessage && (
            <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded-lg">
              {popupMessage}
            </div>
          )}

          <h1 className="text-4xl font-bold">{product.title}</h1>

          <p className="text-gray-600">{product.description}</p>

          <div className="text-4xl font-bold text-blue-600">
            ${product.price} AUD
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-3 rounded-xl font-semibold transition-colors
                      bg-black text-white
                      dark:bg-white dark:text-black
                      hover:opacity-90"
          >
            Add To Cart
          </button>
        </div>
      </div>

      <div className="mt-14 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">Product Details</h2>
        <article className="prose max-w-none" data-test-id="product-markdown">
          <ReactMarkdown>{cleanedContent}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
*/

import { prisma } from "@repo/db/prisma";
import ProductClient from "./ProductClient";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const product = await prisma.product.findFirst({
    where: {
      urlId,
      active: true,
    },
  });

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        Product not found
      </div>
    );
  }

  return <ProductClient product={product} />;
}