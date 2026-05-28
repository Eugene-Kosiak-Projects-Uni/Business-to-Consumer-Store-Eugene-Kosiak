import { NextResponse } from "next/server";
import { products } from "@repo/db/data";

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

  // Create new product
  const newProduct = {
    id: products.length + 1,

    // URL ID from title (e.g. "My First Post" → "my-first-post")
    urlId: generateUrlId(title),

    title,
    description,
    content,
    tags: tags || "",
    imageUrl,
    category,
    brand,
    date: new Date(),

    price: Number(price ?? 0),
    stock: Number(stock ?? 0),
    rating: Number(rating ?? 0),

    featured: Boolean(featured),
    active: Boolean(active),
  };

  // add product to mock data array
  products.push(newProduct);

  // return successful response
  return NextResponse.json(newProduct, { status: 200 });
}

/* - Original Create post API route with prisma
import { prisma } from "@repo/db/prisma";

// simple slug function
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
  const { title, description, content, tags, imageUrl, category } = body;

  if (!title || !description || !content || !imageUrl || !category) {
    return new Response("Missing fields", { status: 400 }); // 400 - invalid request form user
  }

  // Counter to make duplicate URL Ids unique
  let counter = 1;
  // Create base URL ID from title (e.g. "My First Post" → "my-first-post")
  let baseUrlId = generateUrlId(title);
  let urlId = baseUrlId;

  // Check if URL ID already exists in database, if it does, add a number suffix to make it unique (e.g. "my-first-post-2")
  while (await prisma.post.findUnique({ where: { urlId } })) {
    urlId = `${baseUrlId}-${counter++}`;
  }
  // Create new post in database
  const post = await prisma.post.create({
    data: {
      title,
      description,
      content,
      tags: tags || "",
      imageUrl,
      category: category, 
      urlId,
      active: true,
    },
  });

  return Response.json(post);
}
*/