/*
export async function seed() {

}
*/

import { PrismaClient } from "@prisma/client";
import { products } from "@repo/db/data";

const client = new PrismaClient();

export async function seed() {
  console.log("🌱 Seeding data...");

  // Delete child tables first
  await client.purchaseItem.deleteMany();
  await client.purchase.deleteMany();

  // Then parents
  await client.product.deleteMany();
  await client.user.deleteMany();

  /*
  const user = await client.user.create({
    data: {
      id: 1,
      email: "user@test.com",
      password:
        "$2b$10$Uuw2CoflIqOEdQI/qBTKReTP6Ds6HMN0Cp981CCipiyoatYlVlwYy",
      role: "CUSTOMER",
    },
  });
  */
  // create multiple users
  await client.user.createMany({
    data: [
      {
        id: 1,
        name: "John Doe",
        email: "user@test.com",
        password: "$2b$10$Uuw2CoflIqOEdQI/qBTKReTP6Ds6HMN0Cp981CCipiyoatYlVlwYy",
        role: "CUSTOMER",
      },
      {
        id: 2,
        name: "Admin Mark",
        email: "admin@test.com",
        password: "$2b$10$nI9hxujTB/Et2ZK6Aj8TEeKxXL8inNrvEzO8wuQr2XIH3W36sd1VO",
        role: "ADMIN",
      },
    ],
  });

  // Create products with FIXED IDs
  for (const product of products) {
    await client.product.create({
      data: {
        id: product.id,
        title: product.title,
        content: product.content,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        tags: product.tags,
        urlId: product.urlId,
        active: product.active,
        date: new Date(product.date),
        stock: product.stock,
        price: product.price,
        brand: product.brand,
        rating: product.rating,
        featured: product.featured,
      },
    });
  }

  const user = await client.user.findUnique({
    where: {
      email: "user@test.com",
    },
  });

  if (user) {
    await client.purchase.create({
      data: {
        userId: user.id,
        total: 348,
        date: new Date(),

        items: {
          create: [
            {
              productId: 1,
              title: "Wireless Headphones",
              price: 199,
              quantity: 1,
            },
            {
              productId: 2,
              title: "RGB Gaming Keyboard",
              price: 149,
              quantity: 1,
            },
          ],
        },
      },
    });
  }

  console.log("✅ Seeding complete");
}

/* - Seed file for posts prisma
import { PrismaClient } from "@prisma/client";
import { products } from "@repo/db/data";

const client = new PrismaClient();

export async function seed() {
  console.log("🌱 Seeding data");

  await client.like.deleteMany();
  await client.post.deleteMany();

  for (const product of products) {
    const createdPost = await client.post.create({
      data: {
        title: product.title,
        content: product.content,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        tags: product.tags
          .split(",")
          .map((t: string) => t.trim())
          .join(","),
        urlId: product.urlId,
        active: product.active,
        date: new Date(),
        views: 0,
      },
    });

    // mock likes (since Product doesn't include likes)
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
      await client.like.create({
        data: {
          postId: createdPost.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
}
*/