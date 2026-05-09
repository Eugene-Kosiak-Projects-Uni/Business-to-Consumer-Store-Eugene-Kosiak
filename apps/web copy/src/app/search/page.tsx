import { Main } from "@/components/Main";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Get search query from URL parameters
  const { q } = await searchParams;

  // Get all posts that are active, and include how many likes each one has.
  const posts = await prisma.post.findMany({
    where: {
      active: true,
    },
    include: {
      _count: {
        select: { likes: true },
      },
    },
  });
  // if query is empty, set it to an empty string to avoid errors when calling toLowerCase
  const query = (q || "").toLowerCase();
  
  // Filter posts to match title or description with the search query (case-insensitive)
  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {q && (
        <h1 className="text-2xl font-semibold text-primary">
          Results for "{q}"
        </h1>
      )}

      {filteredPosts.length === 0 ? (
        <p className="text-secondary">0 Posts</p>
      ) : (
        <Main posts={filteredPosts} />
      )}
    </div>
  );
}