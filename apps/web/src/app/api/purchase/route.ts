import type { Purchase } from "@repo/db/data";

let purchases: Purchase[] = []; // temp storage

// Create a Purchase
export async function POST(req: Request) {
  const body = await req.json();

  // Create purchse object
  const newPurchase: Purchase = {
    id: Date.now(),
    userId: "customer",
    date: new Date(),
    // Converts cart items into purchase items - creating an array with .map
    items: body.cart.map((item: any) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    })),
    // Calculates total pricing
    total: body.cart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    ),
  };

  // Save purchase
  purchases.push(newPurchase);

  return Response.json(newPurchase);
}

// Get all purchases
export async function GET() {
  return Response.json(purchases);
}

// Remove purchase
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);

  // Reset purchase page when testing, both header and url contains reset, to properly reset
  const isTestReset =
    req.headers.get("x-test-reset") === "true" &&
    searchParams.get("reset") === "true";

  if (isTestReset) {
    purchases = []; // clear purchases
    return Response.json({ reset: true });
  }

  // get id from URL and converts to number
  const id = Number(searchParams.get("id"));

  const index = purchases.findIndex((p) => p.id === id);

  if (index === -1) {
    return Response.json(
      { error: "Purchase not found" },
      { status: 404 }
    );
  }

  purchases.splice(index, 1);

  return Response.json({ success: true });
}