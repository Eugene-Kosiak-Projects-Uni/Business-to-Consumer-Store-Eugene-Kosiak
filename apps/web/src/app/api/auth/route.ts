import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

export async function POST(req: Request) {
  const formData = await req.formData();
  const password = formData.get("password") as string;

  if (password !== "user123") {
    return new Response("Invalid password", { status: 401 });
  }

  const token = jwt.sign(
    { user: "customer" },
    SECRET,
    { expiresIn: "15m" }
  );

  const res = NextResponse.redirect(new URL("/", req.url));

  res.cookies.set("user_auth_token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return res;
}

export async function DELETE(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url));

  res.cookies.set("user_auth_token", "", {
    path: "/",              // MUST match login cookie
    expires: new Date(0),   // force delete
  });

  return res;
}