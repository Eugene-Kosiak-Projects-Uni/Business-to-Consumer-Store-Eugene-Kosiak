import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { headers } from "next/headers";

export const dynamic = "force-dynamic"; // Disables caching - allways fetch data from server

// Creates a global container for Prisma - to prevent multiple clients
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
// Reuse existing prisma client, else create new
const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

// Prevents creating multiple database connections in dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  //Get URL parameter
  const { urlId } = await params;
  // Get request headers
  const headersList = await headers();
  // Get user's IP address (used to prevent multiple likes from same user)
  const ip =
  // get URL, split by comma if IP exists, take first one (in case of multiple IPs)
  // falback if not found
    headersList.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  // Allways increment view count when someone visits post
  await prisma.post.update({
    where: { urlId },
    data: {
      views: { increment: 1 },
    },
  });

  // Fetch updated post with likes included
  const post = await prisma.post.findUnique({
    where: { urlId },
    include: { likes: true },
  });

  if (!post) return <div>Article not found</div>;

  // check if any like on this post matches the user’s IP - Detect if user already liked
  const hasLiked = post.likes.some((l) => l.userIP === ip);

  return (
    <div
      data-test-id={`blog-post-${post.id}`}
      className="max-w-3xl text-primary"
    >
      {/* DATE + CATEGORY */}
      <p>
        {post.date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}{" "}
        {post.category}
      </p>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">
        <Link href={`/post/${post.urlId}`}>{post.title}</Link>
      </h1>

      {/* IMAGE */}
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-96 object-cover rounded-lg mb-4"
      />

      {/* TAGS */}
      <p>
        {post.tags.split(",").map((tag) => (
          <span key={tag}> #{tag} </span>
        ))}
      </p>

      {/* VIEWS */}
      <p>{post.views} views</p>

      {/* LIKES */}
      <div className="mt-2 flex items-center gap-3">
        <p className="text-base font-medium">
          {post.likes.length} likes
        </p>

        <form action="/api/likes" method="POST">
          <input type="hidden" name="postId" value={post.id} />
          <input
            type="hidden"
            name="action"
            value={hasLiked ? "unlike" : "like"}
          />

          <button
            data-test-id="like-button"
            className={`px-4 py-2 text-white rounded transition ${
              hasLiked
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {hasLiked ? "Dislike" : "Like"}
          </button>
        </form>
      </div>

      {/* CONTENT */}
      <div data-test-id="content-markdown" className="prose mt-6">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}