import { products } from "@repo/db/data";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function Page({
  params,
}: {
  params: { urlId: string };
}) {
  const product = products.find((p) => p.urlId === params.urlId);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-3xl">
      <p>
        {new Date(product.date).toLocaleDateString("en-GB")} •{" "}
        {product.category}
      </p>

      <h1 className="text-3xl font-bold mb-4">
        {product.title}
      </h1>

      <img
        src={product.imageUrl}
        className="w-full h-96 object-cover mb-4"
      />

      <p>{product.description}</p>

      <p className="mt-2">{product.price} AUD</p>

      <div className="prose mt-6">
        <ReactMarkdown>{product.content}</ReactMarkdown>
      </div>

      <Link href="/">Back</Link>
    </div>
  );
}