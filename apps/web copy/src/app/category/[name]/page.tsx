import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  // Get category name from URL
  const { name } = await params;

  // Get posts from database that are active
  const posts = await prisma.post.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { likes: true }, // add number of likes for each post
      },
    },
  });

  // Convert category into URL format, compare it to name from URL
  const filteredPosts = posts.filter(
    (post) => toUrlPath(post.category) === name
  );

  return filteredPosts.length === 0 ? (
    <p className="text-secondary">0 Posts</p>
  ) : (
    <Main posts={filteredPosts} />
  );
}