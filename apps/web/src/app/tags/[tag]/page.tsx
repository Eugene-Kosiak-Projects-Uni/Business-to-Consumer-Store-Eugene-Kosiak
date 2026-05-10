//import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";
import { products } from "@repo/db/data";
import { ProductGrid } from "@/components/ProductGrid";

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  const filteredProducts = products.filter(
    (p) =>
      p.active &&
      p.tags
        .split(",")
        .map((t) => toUrlPath(t.trim()))
        .includes(tag)
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          #{tag}
        </h1>

        <p className="text-gray-600 mt-2">
          Products tagged with "{tag}"
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