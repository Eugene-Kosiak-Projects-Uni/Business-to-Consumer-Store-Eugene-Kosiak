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

    // Reads JWT token from browser
    const token = (await cookies()).get(
      "user_auth_token"
    )?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    // Verify JWT token
    const decoded = jwt.verify(token, SECRET) as {
      id: number;
    };

    const { sessionId } = await req.json();

    // Retrieve session from Stripe to get line items
    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: [
            "line_items",
            "line_items.data.price.product",
          ], // include purchased products
        }
      );

    // Get all purchased products, return nothing if no products purchased
    const lineItems = session.line_items?.data || [];

    // Create purchase row in purchase database with user ID, total price, and associated items
    const purchase = await prisma.purchase.create({
      data: {
        userId: decoded.id, // specific user

        total: (session.amount_total || 0) / 100, // stripe stores money in cents

        items: {
          create: lineItems.map((item: any) => ({
            productId: Number(
              (item.price?.product as Stripe.Product)
                ?.metadata?.productId ?? 1
            ),

            imageUrl:
              (item.price?.product as Stripe.Product)
                ?.metadata?.imageUrl || "",

            title: item.description || "Unknown Product",

            price: (item.price?.unit_amount || 0) / 100,

            quantity: item.quantity || 1,
          })),
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