import { NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";

// slug function - to type title of product in URL link rather than by number
function generateUrlId(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")       // spaces → dashes
    .replace(/[^\w-]+/g, "");   // remove non-word chars
}

export async function POST(req: Request) {
  // Extract form data from request body (JSON data sent from frontend to backend)
  const body = await req.json();

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
      { status: 400 } // 400 - invalid request form user
    );
  }

  // Counter to make duplicate URL Ids unique
  let counter = 1;

  // Create base URL ID from title
  let baseUrlId = generateUrlId(title);
  let urlId = baseUrlId;

  // Check if URL ID already exists in database
  while (await prisma.product.findUnique({ where: { urlId } })) {
    urlId = `${baseUrlId}-${counter++}`;
  }

  // Create new product
  const newProduct = await prisma.product.create({
    data: {
      title,
      description,
      content,
      tags: tags || "",
      imageUrl,
      category,
      brand,
      urlId,
      date: new Date(),
      price: Number(price ?? 0),
      stock: Number(stock ?? 0),
      rating: Number(rating ?? 0),
      featured: Boolean(featured),
      active: Boolean(active),
    },
  });

  // return successful response
  return NextResponse.json(newProduct, { status: 200 });
}