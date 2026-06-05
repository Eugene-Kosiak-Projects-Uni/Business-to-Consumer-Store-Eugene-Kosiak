import { NextResponse } from "next/server";
import Stripe from "stripe";

// Create Stripe checkout session for cart items
export async function POST(req: Request) {
  try {
    // Create Stripe object function
    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY || "",
      {
        apiVersion: "2026-05-27.dahlia",
      }
    );

    // Check if stripe key is missing
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe key missing" },
        { status: 500 }
      );
    }
    // Reads JSON sent from the cart page.
    const { products } = await req.json();
    
    // Create Stripe checkout session with cart items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      // Converts cart items into Stripe's expected format
      line_items: products.map(
        (
          product: {
            id: number;
            title: string;
            imageUrl: string;
            price: number;
            quantity: number;
          }
        ) => ({ // => take one product and return an object in the format Stripe expects
          price_data: {
            currency: "aud",
            product_data: {
              name: product.title,
              images: [product.imageUrl],
              metadata: {
                productId: product.id.toString(),
                imageUrl: product.imageUrl,
              },
            },

            unit_amount: Math.round(product.price * 100),
          },

          quantity: product.quantity,
        })
      ),

      mode: "payment",

      // Where Stripe sends the customer after successful payment.
      success_url: `${req.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${req.headers.get("origin")}/cart`,
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