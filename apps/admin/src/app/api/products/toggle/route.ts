import { NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";

export async function POST(req: Request) {
  // Get id from request body (JSON data sent from frontend to backend)
  const { id } = await req.json();

  const productId = Number(id);

  // Find product with matching id
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return new NextResponse("Product not found", { status: 404 });
  }

  // Toggle active status
  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      active: !product.active,
    },
  });

  // Return updated product
  return NextResponse.json(updated);
}