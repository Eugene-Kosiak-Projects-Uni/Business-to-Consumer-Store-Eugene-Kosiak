import { prisma } from "@repo/db/prisma";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export async function LeftMenu() {
  const posts = await prisma.post.findMany();

  return (
    <div>
      {/* SIDEBAR */}
      <div>Top Links and blog name</div>
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <CategoryList posts={posts} />
          </li>
          <li>
            <HistoryList selectedYear="" selectedMonth="" posts={posts} />
          </li>
          <li>
            <TagList selectedTag="" posts={posts} />
          </li>
          <li>Admin</li>
        </ul>
      </nav>
    </div>
  );
}
