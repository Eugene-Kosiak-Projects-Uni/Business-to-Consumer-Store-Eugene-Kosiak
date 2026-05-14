import { isLoggedIn } from "../../../utils/auth";
import { redirect } from "next/dist/client/components/navigation";
import PostForm from "../../components/ProductForm";

export default async function CreatePage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  // Render Create Product Screen
  return (
    <main>
      <PostForm 
        action="/api/products" 
        title="Create Product"
      />
    </main>
  );
}