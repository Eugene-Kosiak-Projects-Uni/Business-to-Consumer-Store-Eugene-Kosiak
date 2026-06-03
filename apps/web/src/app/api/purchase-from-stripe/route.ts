import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@repo/db/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

export async function POST(req: Request) {
  try {
    // Create stripe INSIDE function
    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY || "",
      {
        apiVersion: "2026-05-27.dahlia",
      }
    );

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe key missing" },
        { status: 500 }
      );
    }

    const token = (await cookies()).get(
      "user_auth_token"
    )?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, SECRET) as {
      id: number;
    };

    const { sessionId } = await req.json();

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: ["line_items"],
        }
      );

    const lineItems = session.line_items?.data || [];

    const purchase = await prisma.purchase.create({
      data: {
        userId: decoded.id,

        total: (session.amount_total || 0) / 100,

        items: {
          create: lineItems.map(
            (
              item: {
                description: string | null;
                amount_total: number | null;
                quantity: number | null;
              }
            ) => ({
              productId: 1,
              title: item.description || "Unknown Product",
              price: (item.amount_total || 0) / 100,
              quantity: item.quantity || 1,
            })
          ),
        },
      },
    });

    return NextResponse.json(purchase);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}