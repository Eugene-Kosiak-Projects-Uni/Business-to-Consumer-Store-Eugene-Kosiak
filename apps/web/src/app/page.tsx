import { products } from "@repo/db/data";
import { ProductGrid } from "@/components/ProductGrid";

export default function HomePage() {
  const featured = products.filter(
    (p) => p.featured && p.active
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <section className="mb-10">
        <h1 className="text-5xl font-bold mb-4">
          Modern Tech Store
        </h1>

        <p className="text-gray-600 text-lg">
          Discover premium electronics, gaming gear,
          and lifestyle products.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Featured Products
        </h2>

        <ProductGrid products={featured} />
      </section>
    </main>
  );
}