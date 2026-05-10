//import { Main } from "@/components/Main";
import { ProductGrid } from "@/components/ProductGrid";
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
    <main className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          {name}
        </h1>

        <p className="text-gray-600 mt-2">
          Browse products in the {name} category.
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">
          No products found.
        </p>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </main>
  );
}