/*
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Wait for the URL info, then grab the id from it.
  const { id } = await params;

  // Parase request body - get raw text (JSON data) from frontend to create post object.
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new NextResponse("Invalid or missing JSON body", { status: 400 });
  }
  
  // What the form data is made up of
  const { title, description, content, tags, imageUrl, category } = body;

  if (!title || !description || !content || !imageUrl || !category) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  try {
    // Update post with new data
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        content,
        tags: tags || "",
        imageUrl,
        category,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("Post not found", { status: 404 }); // 404 - not found
    }

    console.error(error);
    return new NextResponse("Server error", { status: 500 }); // 500 - server error
  }
}
*/


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const productId = Number(id);

  // Parse request body - get raw text (JSON data) from frontend to create product object.
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // What the form data is made up of
  const {
    title,
    description,
    content,
    tags,
    imageUrl,
    category,
    brand,
    price,
    stock,
    rating,
    featured,
    active,
  } = body;

  // Checks if required fields exist and aren’t empty
  if (
    !title?.trim() ||
    !description?.trim() ||
    !content?.trim() ||
    !imageUrl?.trim() ||
    !category?.trim() ||
    !brand?.trim()
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Update product with Prisma
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        title,
        description,
        content,
        tags: tags || "",
        imageUrl,
        category,
        brand,

        // Converts types safely
        price: Number(price ?? 0),
        stock: Number(stock ?? 0),
        rating: Number(rating ?? 0),

        featured: Boolean(featured),
        active: Boolean(active),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const productId = Number(id);

  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}