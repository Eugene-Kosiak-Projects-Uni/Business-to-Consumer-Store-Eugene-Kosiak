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

// shared in-memory store (IMPORTANT: must match create route)
let mockProducts: any[] = [];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  let body;
  try {
    body = await request.json();
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  const { title, description, content, tags, imageUrl, category } = body;

  if (
    !title?.trim() ||
    !description?.trim() ||
    !content?.trim() ||
    !imageUrl?.trim() ||
    !category?.trim()
  ) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const index = mockProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  mockProducts[index] = {
    ...mockProducts[index],
    title,
    description,
    content,
    tags: tags || "",
    imageUrl,
    category,
  };

  return NextResponse.json(mockProducts[index]);
}