import Link from "next/link";
import { Product } from "@repo/db/data";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white">
      
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-full h-56 object-cover"
      />

      <div className="p-4 space-y-3">
        
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-lg">
            {product.title}
          </h2>

          <span className="font-bold text-blue-600">
            ${product.price}
          </span>
        </div>

        <p className="text-sm text-gray-600">
          {product.description}
        </p>

        <div className="flex justify-between text-sm">
          <span>{product.category}</span>

          <span>
            ⭐ {product.rating}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              product.stock > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `In Stock (${product.stock})`
              : "Out of Stock"}
          </span>
        </div>

        <Link
          href={`/products/${product.urlId}`}
          className="block w-full text-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          View Product
        </Link>

      </div>
    </div>
  );
}