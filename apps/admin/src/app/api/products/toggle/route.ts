import { NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";
import { isLoggedIn } from "../../../../utils/auth";

export async function POST(req: Request) {
  /*
  Check if the user is logged in and return 401 if the JWT is missing, invalid, or expired
  To prevent unauthorised toggling of product active status.
  */
  try {
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Session expired" },
      { status: 401 }
    );
  }

  // Get id from request body (JSON data sent from frontend to backend)
  const { id } = await req.json();

  // Go to Product table and find product with specific id
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    return new Response("Product not found", { status: 404 }); // 404 - not found
  }

  // Update product active status
  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      active: !product.active,
    },
  });

  // Return updated product
  return NextResponse.json(updated);
}