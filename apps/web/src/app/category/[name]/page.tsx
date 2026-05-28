import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";
//import { prisma } from "@repo/db/prisma";
import { products } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  // Get category name from URL
  const { name } = await params;

  // filter active products
  const activeProducts = products.filter((p) => p.active);

  // Convert category into URL format, compare it to name from URL
  const filteredProducts = activeProducts.filter(
    (product) => toUrlPath(product.category) === name
  );

  return filteredProducts.length === 0 ? (
    <p className="text-secondary">0 Products</p>
  ) : (
    <Main products={filteredProducts} />
  );
}