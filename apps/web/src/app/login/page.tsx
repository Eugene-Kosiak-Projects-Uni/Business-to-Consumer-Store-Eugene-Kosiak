import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;
  /* 1. Checks for JWT token
    get all cookies, specifically look for auth token cookie safely without throwing error if it doesn't exist
  */
  const cookieStore = await cookies(); 
  const token = cookieStore.get("user_auth_token")?.value;

  let loggedIn = false;

  try {
    /* 2. Verify JWT token exists and is valid
      if token exists, check if token is valid, signed in with secret, not expired
    */
    if (token) jwt.verify(token, SECRET);
    loggedIn = true;
  } catch {
    // 3. Handles invalid / missing token
    loggedIn = false;
  }

  // 4. Shows login if not authenticated
  if (!token || !loggedIn) {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white text-black p-8 rounded-xl shadow-xl border-4 border-black w-full max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-center text-black">
            User Login
            </h1>

            {error === "invalid" && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
                Invalid email or password. Please register.
              </div>
            )}

            <form action="/api/auth" method="POST" className="space-y-4">

            <input
                name="email"
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 border rounded text-black"
            />
            
            <input
                name="password"
                type="password"
                placeholder="Enter password"
                className="w-full px-3 py-2 border rounded text-black"
            />

            <button className="w-full bg-black text-white py-2 rounded">
                Login
            </button>

            <div className="mt-4 text-center">
              <Link
                href="/register"
                className="text-blue-600 hover:underline"
              >
                Create a new account
              </Link>
            </div>
            </form>
        </div>
        </main>
    );
}

  return (
    <main className="p-10 text-center">
      <h1 className="text-2xl font-bold">Already logged in</h1>
      <Link href="/">Back to store</Link>
    </main>
  );
}