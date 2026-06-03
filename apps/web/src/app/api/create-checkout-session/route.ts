import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: "2026-05-27.dahlia",
  }
);

export async function POST(req: Request) {
  try {
    const { products } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: products.map((product: any) => ({
        price_data: {
          currency: "aud",

          product_data: {
            name: product.title,
            images: [product.imageUrl],
          },

          unit_amount: Math.round(product.price * 100),
        },

        quantity: product.quantity,
      })),

      mode: "payment",

      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${req.headers.get(
        "origin"
      )}/cart`,
    });

    return NextResponse.json({
      id: session.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}