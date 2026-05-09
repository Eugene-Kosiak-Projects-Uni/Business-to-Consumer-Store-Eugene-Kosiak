import { Main } from "@/components/Main";
import { prisma } from "@repo/db/prisma";

export default async function Page() {
  // Get all active posts, and include how many likes each one has.
  const activePosts = await prisma.post.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { likes: true },
      },
    },
  });

  return <Main posts={activePosts} />;
}