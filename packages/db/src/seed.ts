export async function seed() {

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