import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db/prisma";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

// Store hash password
/* - Delete later
const HASHED_PASSWORD =
  "$2b$10$Uuw2CoflIqOEdQI/qBTKReTP6Ds6HMN0Cp981CCipiyoatYlVlwYy";
*/
// LOGIN
export async function POST(req: Request) {
  const formData = await req.formData(); // read login form data

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Check user exists
  /*
  if (!user) {
    return new Response("Invalid email or password", { status: 401 });
  }
  */

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?error=invalid", req.url)
    );
  }

  // compares user input with stored hashed password
  const isValid = await bcrypt.compare(password, user.password);

  /*
  if (!isValid) {
    return new Response("Invalid email or password", { status: 401 });
  }
  */
  if (!isValid) {
    return NextResponse.redirect(
      new URL("/login?error=invalid", req.url)
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    SECRET,
    { expiresIn: "3m" }
  );

  // Redirect to home page after login
  const res = NextResponse.redirect(new URL("/", req.url));

  res.cookies.set("user_auth_token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return res;
}

// LOGOUT
export async function DELETE(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url));

  res.cookies.set("user_auth_token", "", {
    path: "/",              // MUST match login cookie
    expires: new Date(0),   // force delete
  });

  return res;
}