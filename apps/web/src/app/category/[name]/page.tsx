import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";
import { products } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params;

  // filter active products
  const activeProducts = products.filter((p) => p.active);

  // match category from URL
  const filteredProducts = activeProducts.filter(
    (product) => toUrlPath(product.category) === name
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Category / {name}
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-secondary">0 Products</p>
      ) : (
        <Main products={filteredProducts} />
      )}
    </div>
  );
}