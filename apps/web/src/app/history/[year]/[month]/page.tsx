import { Main } from "@/components/Main";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  // Create Date range
  const start = new Date(Number(year), Number(month) - 1, 1);
  const end = new Date(Number(year), Number(month), 1);

  // Filter active products and filter them by date
  const filteredProducts = await prisma.product.findMany({
    where: {
      active: true,
      date: {
        gte: start,
        lt: end,
      },
    },
  });

  // Format month from num to string
  const monthName = new Date(
    Number(year),
    Number(month) - 1
  ).toLocaleString("en-GB", { month: "long" });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        History / {monthName}, {year}
      </h1>

      {filteredProducts.length === 0 ? (
        <p>0 Products</p>
      ) : (
        <Main products={filteredProducts} />
      )}
    </div>
  );
}