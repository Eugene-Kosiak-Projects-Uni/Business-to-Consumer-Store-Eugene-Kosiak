import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";
import type { Product } from "@repo/db/data";

export function CategoryList({ products }: { products: Product[] }) {
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <>
      {categories.map((cat) => {
        const count = products.filter(
          (p) => p.active && p.category === cat
        ).length;

        return (
          <SummaryItem
            key={cat}
            count={count}
            name={cat}
            isSelected={false}
            link={`/category/${toUrlPath(cat)}`}
            title={`Category / ${cat}`}
          />
        );
      })}
    </>
  );
}