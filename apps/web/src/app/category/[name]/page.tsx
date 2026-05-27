import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const activeProducts = await prisma.product.findMany({
    where: { active: true },
  });

  const filteredProducts = activeProducts.filter(
    (product) => toUrlPath(product.category) === name
  );

  return filteredProducts.length === 0 ? (
    <p className="text-secondary">0 Products</p>
  ) : (
    <Main products={filteredProducts} />
  );
}