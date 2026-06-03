import { NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";

export async function POST(req: Request) {
  // Get id from request body (JSON data sent from frontend to backend)
  const { id } = await req.json();

  // Find product with matching id
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    return new Response("Product not found", { status: 404 }); // 404 - not found
  }

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: { // update product with active status
      active: !product.active,
    },
  });

  // Return updated product
  return NextResponse.json(updated);
}

/* - Post prisma data
import { prisma } from "@repo/db/prisma";

export async function POST(req: Request) {
  // Get id from request body (JSON data sent from frontend to backend)
  const { id } = await req.json();

  // Go to Post table and find post with specific id
  const post = await prisma.post.findUnique({
    where: { id }, // Find post that matches id
  });

  if (!post) {
    return new Response("Post not found", { status: 404 }); // 404 - not found
  }

  // Update posts active status
  const updated = await prisma.post.update({
    where: { id },
    data: { // update post with active status
      active: !post.active,
    },
  });

  return Response.json(updated);
}
*/