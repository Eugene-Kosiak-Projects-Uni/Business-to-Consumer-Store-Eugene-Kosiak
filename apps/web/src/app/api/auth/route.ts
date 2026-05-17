import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

// Store hash password
const HASHED_PASSWORD =
  "$2b$10$Uuw2CoflIqOEdQI/qBTKReTP6Ds6HMN0Cp981CCipiyoatYlVlwYy";

export async function POST(req: Request) {
  const formData = await req.formData();
  const password = formData.get("password") as string;
  const isValid = await bcrypt.compare(password, HASHED_PASSWORD);

  if (!isValid) {
    return new Response("Invalid password", { status: 401 });
  }

  const token = jwt.sign(
    { user: "customer" },
    SECRET,
    { expiresIn: "3m" }
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