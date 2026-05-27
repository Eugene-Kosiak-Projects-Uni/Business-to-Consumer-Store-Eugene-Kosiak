import { history } from "@/functions/history";
import type { Product } from "@prisma/client";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  products,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  products: Product[];
}) {
  const historyItems = history(products);

  return <div>History List</div>;
}
