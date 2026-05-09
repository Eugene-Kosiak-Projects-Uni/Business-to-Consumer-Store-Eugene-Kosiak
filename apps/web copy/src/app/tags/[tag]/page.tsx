import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  // Get tag from URL
 const { tag } = await params;
  // Get all active posts, and include how many likes each post has.
 const posts = await prisma.post.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { likes: true },
      },
    },
  });

  // Filter posts by tag
  const filteredPosts = posts.filter((post) =>
    (post.tags ?? "") // if tag is null, use empty string
      .split(",") // split tags by comma into array
      .map((t) => toUrlPath(t.trim())) // remove whitespace and convert to URL format
      .includes(tag) // If any tag matches the URL tag - include post
  );

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-semibold text-primary"
        title={`Tag / ${tag}`}
      >
        #{tag}
      </h1>

      {filteredPosts.length === 0 ? (
        <p className="text-secondary">0 Posts</p>
      ) : (
        <Main posts={filteredPosts} />
      )}
    </div>
  );
}