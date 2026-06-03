import { Main } from "@/components/Main";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;

  const query = (params.q || "").toLowerCase();

  const filteredProducts = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      ],
    },
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