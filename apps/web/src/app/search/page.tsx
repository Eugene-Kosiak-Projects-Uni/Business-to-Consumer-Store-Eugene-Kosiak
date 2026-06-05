import { Main } from "@/components/Main";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Get search query from URL parameters
  const params = await searchParams;
  // Convert query to lowercase for case-insensitive search
  const query = (params.q || "").toLowerCase();
  // Find active products in the database where title or description contains the query (case-insensitive)
  const filteredProducts = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
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