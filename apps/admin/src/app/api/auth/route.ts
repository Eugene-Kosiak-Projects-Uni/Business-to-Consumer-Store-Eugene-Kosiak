import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";
import bcrypt from "bcryptjs";

// Secret key used to sign JWT tokens
const SECRET = env.JWT_SECRET;

/*
  IMPORTANT:
  We do NOT hash at runtime.
  Instead we store a deterministic hash derived once.
*/
const HASHED_PASSWORD = bcrypt.hashSync(env.PASSWORD, 10);

// POST method (LOGIN)
export async function POST(req: Request) {
  let password: string | null = null;

  const contentType = req.headers.get("content-type") || "";

  // Parse request body
  if (contentType.includes("application/json")) {
    const body = await req.json();
    password = body.password;
  } else {
    const formData = await req.formData();
    password = formData.get("password") as string | null;
  }

  if (!password) {
    return new Response("Missing password", { status: 400 });
  }

  // Compare password using bcrypt
  const isValid = await bcrypt.compare(password, HASHED_PASSWORD);

  if (!isValid) {
    return new Response("Invalid password", { status: 401 });
  }

  // Create JWT token
  const token = jwt.sign(
    { user: "admin" },
    SECRET,
    { expiresIn: "15m" }
  );

  // Redirect after login
  const res = NextResponse.redirect(new URL("/", req.url));

  res.cookies.set("auth_token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return res;
}

// DELETE method (LOGOUT)
export async function DELETE(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));

  res.cookies.set("auth_token", "", {
    expires: new Date(0),
    path: "/",
  });

  return res;
}