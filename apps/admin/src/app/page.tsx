import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";
import { prisma } from "@repo/db/prisma";
import ProductList from "./components/ProductList";

export default async function Home() {
  /* 1. Checks for JWT token
    get all cookies, specifically look for auth token cookie safely without throwing error if it doesn't exist
  */
  const token = (await cookies()).get("auth_token")?.value;

  let loggedIn = false;

  try {
    /* 2. Verify JWT token exists and is valid
      if token exists, check if token is valid, signed in with secret, not expired
    */
    if (token) {
      jwt.verify(token, env.JWT_SECRET);
      loggedIn = true;
    }
  } catch {
    // 3. Handles invalid / missing token
    loggedIn = false;
  }

  // 4. Shows login if not authenticated
  if (!loggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

          <h1 className="admin-title text-3xl mb-2 text-center">
            Admin Login
          </h1>

          <p className="text-center text-gray-600 mb-6">
            Sign in to your account
          </p>

          <form action="/api/auth" method="POST" className="space-y-4">

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                className="admin-input"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="admin-input"
              />
            </div>

            <button type="submit" className="admin-btn w-full">
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  // 5. Fetch products from Prisma
  const products = await prisma.product.findMany({
    orderBy: {
      date: "desc",
    },
  });

  // 6. Shows admin content if valid
  return <ProductList products={products} />;
}