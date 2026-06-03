import { CategoryList } from "./CategoryList";
import { TagList } from "./TagList";
import { prisma } from "@repo/db/prisma";

export async function LeftMenu() {
  const products = await prisma.product.findMany();
  return (
    <div>
      <div>Top Links and blog name</div>

      <nav>
        <ul className="flex flex-col gap-y-7">
          <li>
            <CategoryList products={products} />
          </li>

          <li>
            <TagList selectedTag="" products={products} />
          </li>

          <li>Admin</li>
        </ul>
      </nav>
    </div>
  );
}