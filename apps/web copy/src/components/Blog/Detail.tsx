import type { Post } from "@prisma/client";
import { marked } from "marked";

export async function BlogDetail({ post }: { post: Post }) {
  // Convert the post’s Markdown content into HTML
  const content = await marked.parse(post.content);

  // return output
  return <article data-test-id={`blog-post-${post.id}`}>Detail</article>;
}
