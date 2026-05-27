import { Main } from "@/components/Main";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;

  const query = (params.q || "").toLowerCase();

  const products = await prisma.product.findMany({
    where: { active: true },
  });

  const filteredProducts = products.filter((p) => {
    return (
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {query && <h1>Results for "{query}"</h1>}

      {filteredProducts.length === 0 ? (
        <p>0 Products</p>
      ) : (
        <Main products={filteredProducts} />
      )}
    </div>
  );
}