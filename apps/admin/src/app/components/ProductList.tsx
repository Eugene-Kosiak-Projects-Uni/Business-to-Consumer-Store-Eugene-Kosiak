"use client";

import { useState } from "react";
//import { Post } from "@prisma/client";
import type { Product } from "@repo/db/data";
import Link from "next/link";


export default function ProductList({ products }: { products: Product[] }) {
  // [current value, function update] = start as empty string
  // State for filters
  
  // Store search input
  const [query, setQuery] = useState("");
  // Store slected tag
  const [tag, setTag] = useState("");
  // Store date filter input
  const [date, setDate] = useState("");
  // Store how results are sorted
  const [sort, setSort] = useState("");
  // Store active status filter
  const [active, setActive] = useState("");
  // Store current state of products
  const [productState, setProductState] = useState(products);
  // Store status message
  const [statusMessage, setStatusMessage] = useState("");

 let filtered = [...productState].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter by content/title
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }

  // Filter by tag
  if (tag) {
    filtered = filtered.filter((p) =>
      p.tags?.toLowerCase().includes(tag.toLowerCase())
    );
  }

  // Filter by date
  if (date.length === 8) {
    const day = Number(date.slice(0, 2));
    const month = Number(date.slice(2, 4)) - 1;
    const year = Number(date.slice(4, 8));

    const filterDate = new Date(year, month, day);
    filterDate.setHours(0, 0, 0, 0); // normalise to remove time

    // filter if the product date matches the filtered date
    filtered = filtered.filter((p) => {
      const productDate =
        p.date instanceof Date ? p.date : new Date(p.date);

      productDate.setHours(0, 0, 0, 0); // normalise to remove time

      return productDate >= filterDate; // keep product date that is AFTER or ON the filter date
    });
  }

  // Filter by activity status
  if (active === "true") {
    filtered = filtered.filter((p) => p.active === true);
  } else if (active === "false") {
    filtered = filtered.filter((p) => p.active === false);
  }

  // Sorting title and date
  if (sort === "title-asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "title-desc") {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sort === "date-asc") {
    filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } else if (sort === "date-desc") {
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // Function to toggle active status of a product, takes the product ID as a parameter
  async function toggleActive(id: number) {
    // Update database with the status change, geting the products ID
    await fetch("/api/products/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    // Update UI instantly 
    setProductState((prev) =>
      prev.map((p) =>
        // check if the product we clicked state is to be updated
        // if so copy product data change state, else unchanged
        p.id === id ? { ...p, active: !p.active } : p
      )
    );

    // Display status message
    const changedProduct = productState.find((p) => p.id === id);

    if (changedProduct) {
      setStatusMessage(
        !changedProduct.active
          ? "Product set to active"
          : "Product set to inactive"
      );

      // clear after 6 seconds
      setTimeout(() => setStatusMessage(""), 6000);
    }
  }

  return (
    <main className="p-8 font-sans">
      <h1
        className="admin-title text-4xl mb-4"
        data-test-id="admin-title"
      >
        Admin of Products
      </h1>

      <form
        onSubmit={async (e) => { // e = the event of loging out of admin page
          e.preventDefault(); // stop browser from refreshing page on submit

          // Send request to log out, delete the auth cookie
          await fetch("/api/auth", {
            method: "DELETE",
          });

          window.location.replace("/"); // redirect to login screen
        }}
        className="mb-4"
      >
        <button type="submit" className="admin-btn text-xl">
          Logout
        </button>
      </form>

      <Link href="/products/create">
        <button className="admin-btn mb-6 text-xl">Create Product</button>
      </Link>

      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex flex-col">
          Filter by Content:
          <input
            className="admin-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <label className="flex flex-col">
          Filter by Tag:
          <input
            className="admin-input"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </label>

        <label className="flex flex-col">
          Filter by Date Created:
          <p>(DDMMYYYY):</p>
          <input
            className="admin-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="flex flex-col">
          Sort By:
          <select
            className="admin-input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="title-asc">title-asc</option>
            <option value="title-desc">title-desc</option>
            <option value="date-asc">date-asc</option>
            <option value="date-desc">date-desc</option>
          </select>
        </label>

        <label className="flex flex-col">
          Filter by Status:
          <select
            className="admin-input"
            value={active}
            onChange={(e) => setActive(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>

        {statusMessage && (
          <p
            className={`mb-4 ${
              statusMessage === "Product set to active"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="product-card flex gap-4 p-4 border rounded"
          >
            <img src={p.imageUrl} alt={p.title} className="w-36 rounded" />

            <div className="flex-1">
              <Link href={`/product/${p.urlId}`}>
                <h2 className="product-title text-xl font-bold">
                  {p.title}
                </h2>
              </Link>

              <p>
                {p.tags
                  .split(",")
                  .map((tag) => `#${tag.trim()}`)
                  .join(", ")}
              </p>

              <p>
                Posted on{" "}
                {new Date(p.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <p>{p.category}</p>

              <button
                data-test-id={`toggle-${p.id}`}
                className="admin-btn mt-2"
                // toogle active status on click, passing the product ID to identify which product to update
                onClick={() => toggleActive(p.id)}
              >
                {p.active ? "Active" : "Inactive"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

/* - Original Post List with prisma
"use client";

import { useState } from "react";
import { Post } from "@prisma/client";
import Link from "next/link";


export default function PostList({ posts }: { posts: Post[] }) {
  // [current value, function update] = start as empty string
  // State for filters
  
  // Store search input
  const [query, setQuery] = useState("");
  // Store slected tag
  const [tag, setTag] = useState("");
  // Store date filter input
  const [date, setDate] = useState("");
  // Store how results are sorted
  const [sort, setSort] = useState("");
  // Store active status filter
  const [active, setActive] = useState("");
  // Store current state of post
  const [postState, setPostState] = useState(posts);
  // Store status message
  const [statusMessage, setStatusMessage] = useState("");

 let filtered = [...postState].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter by content/title
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }

  // Filter by tag
  if (tag) {
    filtered = filtered.filter((p) =>
      p.tags?.toLowerCase().includes(tag.toLowerCase())
    );
  }

  // Filter by date
  if (date.length === 8) {
    const day = Number(date.slice(0, 2));
    const month = Number(date.slice(2, 4)) - 1;
    const year = Number(date.slice(4, 8));

    const filterDate = new Date(year, month, day);
    filterDate.setHours(0, 0, 0, 0); // normalise to remove time

    // filter if the post date matches the filtered date
    filtered = filtered.filter((p) => {
      const postDate =
        p.date instanceof Date ? p.date : new Date(p.date);

      postDate.setHours(0, 0, 0, 0); // normalise to remove time

      return postDate >= filterDate; // keep post date that is AFTER or ON the filter date
    });
  }

  // Filter by activity status
  if (active === "true") {
    filtered = filtered.filter((p) => p.active === true);
  } else if (active === "false") {
    filtered = filtered.filter((p) => p.active === false);
  }

  // Sorting title and date
  if (sort === "title-asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "title-desc") {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sort === "date-asc") {
    filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } else if (sort === "date-desc") {
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // Function to toggle active status of a post, takes the post ID as a parameter
  async function toggleActive(id: number) {
    // Update database with the status change, geting the posts ID
    await fetch("/api/posts/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    // Update UI instantly 
    setPostState((prev) =>
      prev.map((p) =>
        // check if the post we clicked state is to be updated
        // if so copy post data change state, else unchanged
        p.id === id ? { ...p, active: !p.active } : p
      )
    );

    // Display status message
    const changedPost = postState.find((p) => p.id === id);

    if (changedPost) {
      setStatusMessage(
        !changedPost.active
          ? "Post set to active"
          : "Post set to inactive"
      );

      // clear after 6 seconds
      setTimeout(() => setStatusMessage(""), 6000);
    }
  }

  return (
    <main className="p-8 font-sans">
      <h1 className="admin-title text-4xl mb-4">
        Admin of Full Stack Blog
      </h1>

      <form
        onSubmit={async (e) => { // e = the event of loging out of admin page
          e.preventDefault(); // stop browser from refreshing page on submit

          // Send request to log out, delete the auth cookie
          await fetch("/api/auth", {
            method: "DELETE",
          });

          window.location.href = "/"; // redirect to login screen
        }}
        className="mb-4"
      >
        <button type="submit" className="admin-btn text-xl">
          Logout
        </button>
      </form>

      <Link href="/posts/create">
        <button className="admin-btn mb-6 text-xl">Create Post</button>
      </Link>

      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex flex-col">
          Filter by Content:
          <input
            className="admin-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <label className="flex flex-col">
          Filter by Tag:
          <input
            className="admin-input"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </label>

        <label className="flex flex-col">
          Filter by Date Created:
          <p>(DDMMYYYY):</p>
          <input
            className="admin-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="flex flex-col">
          Sort By:
          <select
            className="admin-input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="title-asc">title-asc</option>
            <option value="title-desc">title-desc</option>
            <option value="date-asc">date-asc</option>
            <option value="date-desc">date-desc</option>
          </select>
        </label>

        <label className="flex flex-col">
          Filter by Status:
          <select
            className="admin-input"
            value={active}
            onChange={(e) => setActive(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>

        {statusMessage && (
          <p
            className={`mb-4 ${
              statusMessage === "Post set to active"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="post-card flex gap-4 p-4 border rounded"
          >
            <img src={p.imageUrl} alt={p.title} className="w-36 rounded" />

            <div className="flex-1">
              <Link href={`/post/${p.urlId}`}>
                <h2 className="post-title text-xl font-bold">
                  {p.title}
                </h2>
              </Link>

              <p>
                {p.tags
                  .split(",")
                  .map((tag) => `#${tag.trim()}`)
                  .join(", ")}
              </p>

              <p>
                Posted on{" "}
                {new Date(p.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <p>{p.category}</p>

              <button
                data-test-id={`toggle-${p.id}`}
                className="admin-btn mt-2"
                // toogle active status on click, passing the post ID to identify which post to update
                onClick={() => toggleActive(p.id)}
              >
                {p.active ? "Active" : "Inactive"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
*/