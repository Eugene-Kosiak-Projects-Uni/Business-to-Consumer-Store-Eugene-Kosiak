// import { posts, type Post } from "../components/data";

export function categories<T>(
  products: { category: string; active: boolean }[],
): { name: string; count: number }[] {
  return products
    .filter((p) => p.active)
    .sort((a, b) => a.category.localeCompare(b.category))
    .reduce(
      (acc, products) => {
        const category = acc.find((c) => c.name === products.category);
        if (category) {
          category.count++;
        } else {
          acc.push({ name: products.category, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[],
    );
}
