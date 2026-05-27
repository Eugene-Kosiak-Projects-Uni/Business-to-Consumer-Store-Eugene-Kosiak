import { prisma } from "@repo/db/prisma";

// Create a Purchase
export async function POST(req: Request) {
  const body = await req.json();

  // Create purchase object in database
  const newPurchase = await prisma.purchase.create({
    data: {
      userId: 1, // TEMP: replace with real logged-in user later

      // Calculates total pricing
      total: body.cart.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      ),

      // Converts cart items into purchase items - creating records
      items: {
        create: body.cart.map((item: any) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return Response.json(newPurchase);
}

// Get all purchases
export async function GET() {
  const purchases = await prisma.purchase.findMany({
    include: {
      items: true,
    },
    orderBy: {
      date: "desc",
    },
  });

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
    await prisma.purchaseItem.deleteMany();
    await prisma.purchase.deleteMany();
    return Response.json({ reset: true });
  }

  // get id from URL and converts to number
  const id = Number(searchParams.get("id"));

  const purchase = await prisma.purchase.findUnique({
    where: { id },
  });

  if (!purchase) {
    return Response.json(
      { error: "Purchase not found" },
      { status: 404 }
    );
  }

  // delete related items first (due to relations)
  await prisma.purchaseItem.deleteMany({
    where: { purchaseId: id },
  });

  await prisma.purchase.delete({
    where: { id },
  });

  return Response.json({ success: true });
}