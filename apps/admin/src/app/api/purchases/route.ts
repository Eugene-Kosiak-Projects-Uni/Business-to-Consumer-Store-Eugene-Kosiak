import { NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

export async function GET() {
  // Read JWT token from cookies
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, env.JWT_SECRET);
  } catch {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
  // Fetch all purchases with related user and product details, ordered by date (newest first)
  const purchases = await prisma.purchase.findMany({
    include: {
      user: true, // Include user details for each purchase

      items: {
        include: {
          product: true, // Include product details for each purchase item
        },
      },
    },

    orderBy: {
      date: "desc",
    },
  });

  return NextResponse.json(purchases);
}