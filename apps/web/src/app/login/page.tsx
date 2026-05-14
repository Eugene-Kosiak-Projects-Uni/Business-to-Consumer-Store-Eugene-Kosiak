import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

export default async function LoginPage() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("user_auth_token")?.value;

  let loggedIn = false;

  try {
    if (token) jwt.verify(token, SECRET);
    loggedIn = true;
  } catch {
    loggedIn = false;
  }

  if (!token || !loggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-center">
            User Login
          </h1>

          <form action="/api/auth" method="POST" className="space-y-4">
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded"
            />

            <button className="w-full bg-black text-white py-2 rounded">
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-3">
            Demo password: <b>user123</b>
          </p>
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