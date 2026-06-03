import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;

  const success = params.success === "true";
  const error = params.error;

  // Check login token
  const cookieStore = await cookies();

  const token = cookieStore.get("user_auth_token")?.value;

  let loggedIn = false;
  let userName = "";

  try {
    if (token) {
      const decoded = jwt.verify(token, SECRET) as {
        name: string;
      };

      loggedIn = true;
      userName = decoded.name;
    }
  } catch {
    loggedIn = false;
  }

  // USER ALREADY LOGGED IN
  if (loggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white text-black p-8 rounded-xl shadow-xl border-4 border-black w-full max-w-md text-center">

          <h1 className="text-3xl font-bold mb-4">
            Account Already Logged In
          </h1>

          <p className="mb-6">
            Hi {userName}, you already have an account and are currently logged in.
          </p>

          <Link
            href="/"
            className="inline-block bg-black text-white px-4 py-2 rounded"
          >
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white text-black p-8 rounded-xl shadow-xl border-4 border-black w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h1>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
            Account created successfully 🎉
          </div>
        )}
        {/* ERROR MESSAGE */}
        {error === "exists" && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
            An account with this email already exists.
          </div>
        )}

        <form
          action="/api/register"
          method="POST"
          className="space-y-4"
        >
          <input
            name="name"
            type="text"
            placeholder="Enter name"
            required
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Enter email"
            required
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Enter password"
            required
            className="w-full px-3 py-2 border rounded"
          />

          <button className="w-full bg-black text-white py-2 rounded">
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </main>
  );
}