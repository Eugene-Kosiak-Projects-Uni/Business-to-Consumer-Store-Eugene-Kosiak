import { Main } from "@/components/Main";
import { prisma } from "@repo/db/prisma";

export default async function HomePage() {
  const activeProducts = await prisma.product.findMany({
    where: { active: true },
  });

  return <Main products={activeProducts} />;
}