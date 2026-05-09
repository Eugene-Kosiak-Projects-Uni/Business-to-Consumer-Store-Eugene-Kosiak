import { Main } from "@/components/Main";
import { products } from "@repo/db/data";

export default async function Page() {
  const activeProducts = products.filter((p) => p.active);

  return <Main products={activeProducts} />;
}