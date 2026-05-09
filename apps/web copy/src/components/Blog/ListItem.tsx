import type { Post } from "@prisma/client";
import Link from "next/link";

// Extend the Post type to include optional likes count
type PostWithOptionalCount = Post & {
  likes?: number;
  _count?: { likes: number };
};

export function BlogListItem({ post }: { post: PostWithOptionalCount }) {
  return (
    <article data-test-id={`blog-post-${post.id}`}>
      <Link href={`/post/${post.urlId}`}>
        {post.title}
      </Link>

      <p>{post.category}</p>

      <p>
        {post.tags.split(",").map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </p>

      <p>
        {post.date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>

      <p>{post.views} views</p>
      <p>{post._count?.likes ?? post.likes} likes</p>
    </article>
  );
}
