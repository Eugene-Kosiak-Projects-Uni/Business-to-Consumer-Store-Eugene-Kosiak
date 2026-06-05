import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  // Get tag from URL parameters
  const { tag } = await params;
  // Find active products in the database
  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
  });
  
  // Filter products to only include those that have the tag in their tags field
  const filteredProducts = products.filter(
    (p) =>
      p.tags
        .split(",")
        .map((t) => toUrlPath(t.trim()))
        .includes(tag)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">#{tag}</h1>

      {filteredProducts.length === 0 ? (
        <p>0 Products</p>
      ) : (
        <Main products={filteredProducts} />
      )}
    </div>
  );
}