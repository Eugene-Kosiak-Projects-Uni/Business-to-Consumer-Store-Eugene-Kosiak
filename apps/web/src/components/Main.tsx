import type { Product } from "@repo/db/data";
import Link from "next/link";

export function Main({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <main className={className || ""}>

      {products.length === 0 ? (
        <p className="text-secondary">0 Products</p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <article
              key={product.id}
              data-test-id={`b2c-${product.id}`}
              className="flex gap-6 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <img
                src={product.imageUrl}
                className="w-64 h-48 object-cover rounded-lg"
                alt={product.title}
              />

              {/* Content */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    <Link
                      href={`/product/${product.urlId}`}
                      className="hover:underline"
                    >
                      {product.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-secondary mb-1">
                    {product.category}
                  </p>

                  <p
                    className="text-secondary mb-3"
                    data-test-id={`product-description-${product.urlId}`}
                  >
                    {product.description.substring(0, 60)}...
                  </p>

                  <p className="text-sm text-secondary mb-2">
                    #{product.tags.split(",").join(" #")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}