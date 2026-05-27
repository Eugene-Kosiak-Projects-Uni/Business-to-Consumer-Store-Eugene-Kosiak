import { Main } from "@/components/Main";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  const start = new Date(Number(year), Number(month) - 1, 1);
  const end = new Date(Number(year), Number(month), 1);

  const products = await prisma.product.findMany({
    where: {
      active: true,
      date: {
        gte: start,
        lt: end,
      },
    },
  });

  const monthName = new Date(
    Number(year),
    Number(month) - 1
  ).toLocaleString("en-GB", { month: "long" });

  return products.length === 0 ? (
    <p>0 Products</p>
  ) : (
    <Main products={products} />
  );
}