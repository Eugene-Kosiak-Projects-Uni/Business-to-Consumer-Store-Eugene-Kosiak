import type { Prisma } from "@prisma/client";
import Link from "next/link";

type PostWithLikes = Prisma.PostGetPayload<{
  include: { _count: { select: { likes: true } } };
}>;

export function Main({
  posts, // recives list of blog posts with like counts from page.tsx
  className, // optional className for styling
}: {
  posts: PostWithLikes[] // expect list of blog posts with like counts
  className?: string; // optional
}) {
  return (
    <main className={className}>
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2 text-primary">
        From the blog
      </h1>

      <p className="text-secondary mb-8">
        Learn how to grow your business with our expert advice.
      </p>

      {/* Posts */}
      {posts.length === 0 ? (
        <p className="text-secondary">0 Posts</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              data-test-id={`blog-post-${post.id}`}
              className="flex gap-6 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <img
                src={post.imageUrl}
                className="w-64 h-48 object-cover rounded-lg"
                alt={post.title}
              />

              {/* Content */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    <Link
                      href={`/post/${post.urlId}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Category */}
                  <p className="text-sm text-secondary mb-1">
                    {post.category}
                  </p>

                  {/* Description */}
                  <p className="text-secondary mb-3">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <p className="text-sm text-secondary mb-2">
                    #{post.tags.split(",").join(" #")}
                  </p>
                </div>

                {/* Bottom */}
                <div className="flex justify-between text-sm text-secondary">
                  <span>
                    {post.date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <div className="flex gap-4">
                    <span>{post.views} views</span>
                    <span>{post._count.likes} likes</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}


