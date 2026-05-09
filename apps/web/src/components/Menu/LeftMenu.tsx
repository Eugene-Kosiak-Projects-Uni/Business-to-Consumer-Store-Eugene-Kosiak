import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import { products } from "@repo/db/data";

export async function LeftMenu() {
  return (
    <div>
      <div>Top Links and blog name</div>

      <nav>
        <ul className="flex flex-col gap-y-7">
          <li>
            <CategoryList products={products} />
          </li>

          <li>
            <HistoryList
              selectedYear=""
              selectedMonth=""
              products={products}
            />
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