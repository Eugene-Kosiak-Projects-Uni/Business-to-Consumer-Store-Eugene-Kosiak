import { prisma } from "@repo/db/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ urlId: string }> }
) {
  // Get product by urlId from query parameters
  const { urlId } = await context.params;
  // Find active product with matching urlId in the database
  const product = await prisma.product.findFirst({
    where: {
      urlId,
      active: true,
    },
  });

  if (!product) {
    return Response.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return Response.json(product);
}