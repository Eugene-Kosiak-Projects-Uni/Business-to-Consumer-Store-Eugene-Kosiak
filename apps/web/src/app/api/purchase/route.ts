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

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
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