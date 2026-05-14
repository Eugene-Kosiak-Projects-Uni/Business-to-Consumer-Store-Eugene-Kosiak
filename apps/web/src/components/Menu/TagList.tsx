//import type { Post } from "@prisma/client";
/*
import type { Product } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import Link from "next/link";
import { toUrlPath } from "@repo/utils/url";

export async function TagList({
  selectedTag,
  products,
}: {
  selectedTag?: string;
  products: Product[];
}) {
  const postTags = await tags(products); // returns ["Back-End", "Front-End", ...] 

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
*/
import type { Product } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import Link from "next/link";
import { toUrlPath } from "@repo/utils/url";

export async function TagList({
  selectedTag,
  products,
}: {
  selectedTag?: string;
  products: Product[];
}) {
  const postTags = await tags(products);

  return (
    <LinkList title="Tags">
      <ul className="space-y-2">
        {postTags.map((tag) => {
          const count = tag.count;

          return (
            <li key={tag.name}>
              <Link
                href={`/tags/${toUrlPath(tag.name)}`}
                title={`Tag / ${tag.name}`}
                data-test-id={`tag-${toUrlPath(tag.name)}`}
                className={
                  selectedTag === tag.name
                    ? "font-bold text-blue-500 underline"
                    : "text-gray-700 dark:text-gray-200 hover:underline hover:text-black dark:hover:text-white"
                }
              >
                #{tag.name}{" "}
                <span
                  data-test-id="post-count"
                  className="ml-2 inline-flex items-center 
                  justify-center min-w-[22px] h-[22px] px-2 
                  rounded-full bg-gray-700 text-white text-xs 
                  font-semibold"
                >
                  {count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </LinkList>
  );
}