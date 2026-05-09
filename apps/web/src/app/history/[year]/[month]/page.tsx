import { Main } from "@/components/Main";
import { products } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: { year: string; month: string };
}) {
  const { year, month } = params;

  const start = new Date(Number(year), Number(month) - 1, 1);
  const end = new Date(Number(year), Number(month), 1);

  const filteredProducts = products
    .filter((p) => p.active)
    .filter((p) => {
      const d = new Date(p.date);
      return d >= start && d < end;
    });

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