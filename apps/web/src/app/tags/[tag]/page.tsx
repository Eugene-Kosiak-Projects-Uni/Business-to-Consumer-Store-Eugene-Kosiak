import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";
import { products } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  const filteredProducts = products.filter(
    (p) =>
      p.active &&
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