import type { Post } from "@prisma/client";
import Link from "next/link";

// Extend the Post type to include optional likes count
type PostWithOptionalCount = Post & {
  likes?: number;
  _count?: { likes: number };
};

// What your component expects - array of posts with optional likes count
type BlogListProps = {
  posts: PostWithOptionalCount[];
};

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return <p>0 Posts</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <article
          key={post.id}
          data-test-id={`blog-post-${post.id}`} // sets a data attribute for testing purposes
        >
          <Link href={`/post/${post.urlId}`} legacyBehavior>
            <a>
              <h2 className="text-xl font-semibold hover:underline">
                {post.title.replace(",", "").replace("!", "")}
              </h2>
            </a>
          </Link>

          <p>{post.category}</p>

          <p>
            {post.tags.split(",").map((tag) => (
              <span key={tag}>#{tag} </span>
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
      ))}
    </div>
  );
}