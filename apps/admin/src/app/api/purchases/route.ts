import { NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

export async function GET() {
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

  const purchases = await prisma.purchase.findMany({
    include: {
      user: true,

      items: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      date: "desc",
    },
  });

  return NextResponse.json(purchases);
}