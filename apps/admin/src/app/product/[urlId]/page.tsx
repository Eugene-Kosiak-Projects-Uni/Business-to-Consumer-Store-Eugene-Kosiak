import { cookies } from "next/headers";
import ProductForm from "../../components/ProductForm";
import { products } from "@repo/db/data";

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  // Check if user is logged in by looking for auth token cookie
  const loggedIn = (await cookies()).has("auth_token");

  if (!loggedIn) {
    return (
      <main>
        <h1>Admin Login</h1>
        <p>Sign in to your account</p>

        <form action="/api/login" method="POST">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />
          <button type="submit">Sign In</button>
        </form>
      </main>
    );
  }

  // Fetch product from MOCK DATA using urlId
  const product = products.find((p) => p.urlId === urlId);

  if (!product) {
    return <main>Product not found</main>;
  }

  // Render Update Product Screen
  return (
    <main>
      <ProductForm
        action={`/api/products/${product.id}`}
        title="Edit Product"
        initialData={product}
      />
    </main>
  );
}

/* - Original Edit post form with prisma
import { cookies } from "next/headers";
import ProductForm from "../../components/ProductForm";
import { prisma } from "@repo/db/prisma";

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  // Check if user is logged in by looking for auth token cookie
  const loggedIn = (await cookies()).has("auth_token");

  if (!loggedIn) {
    return (
      <main>
        <h1>Admin Login</h1>
        <p>Sign in to your account</p>

        <form action="/api/login" method="POST">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />
          <button type="submit">Sign In</button>
        </form>
      </main>
    );
  }

  // Fetch product data from database where the urlId matches the urlId in the URL parameters
  const product = await prisma.product.findUnique({
    where: { urlId },
  });

  if (!product) {
    return <main>Product not found</main>;
  }

  // Render Update Product Screen
  return (
    <main>
      <ProductForm
        action={`/api/products/${product.id}`}
        title="Edit Product"
        initialData={{
          title: product.title,
          description: product.description,
          content: product.content,
          tags: product.tags ?? "",
          imageUrl: product.imageUrl,
          category: product.category,
        }}
      />
    </main>
  );
}
*/