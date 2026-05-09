import type { Post } from "@prisma/client";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import Link from "next/link";
import { toUrlPath } from "@repo/utils/url";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = await tags(posts); // returns ["Back-End", "Front-End", ...] 

  return (
    <LinkList title="Tags">
      <ul className="text-gray-500 hover:text-gray-700 dark:text-white space-y-2"> 
        {postTags.map((tag) => {
        const count = tag.count;

        return (
          <li key={tag.name}>
            <Link
              href={`/tags/${toUrlPath(tag.name)}`}
              title={`Tag / ${tag.name}`}
              className={
                selectedTag === tag.name
                  ? "font-bold text-blue-500"
                  : "hover:underline"
              }
            >
              #{tag.name}{" "}
              <span data-test-id="post-count">{count}</span>
            </Link>
          </li>
        );
      })}
      </ul>
    </LinkList>
  );
}