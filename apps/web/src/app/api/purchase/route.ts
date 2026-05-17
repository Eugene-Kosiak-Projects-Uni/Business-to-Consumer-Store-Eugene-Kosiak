import type { Purchase } from "@repo/db/data";

let purchases: Purchase[] = []; // temp storage

export async function POST(req: Request) {
  const body = await req.json();

  const newPurchase: Purchase = {
    id: Date.now(),
    userId: "customer",
    date: new Date(),
    items: body.cart.map((item: any) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    })),
    total: body.cart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    ),
  };

  purchases.push(newPurchase);

  return Response.json(newPurchase);
}

export async function GET() {
  return Response.json(purchases);
}