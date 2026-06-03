"use client";

import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import remarkGfm from "remark-gfm";
import Link from "next/link";

// props type for post form component
type Product = {
  title: string;
  description: string;
  content: string;
  tags: string;
  imageUrl: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  featured: boolean;
  active: boolean;
};

export default function ProductForm({
  initialData,
  action,
  title
}: {
  initialData?: Product;
  action: string;
  title: string;
}) {
  // Stores form input values
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    tags: "",
    imageUrl: "",
    category: "",
    brand: "",
    price: 0,
    stock: 0,
    rating: 0,
    featured: false,
    active: false,
  });
  // Stores validation errors
  const [errors, setErrors] = useState<string[]>([]);
  // Toggles markdown preview
  const [preview, setPreview] = useState(false);
  // Shows success message
  const [success, setSuccess] = useState("");

  // Used when editing post, pre-fills form with existing data
  // Runs when initialData changes (e.g. when loading post to edit)
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        content: initialData.content,
        tags: initialData.tags,
        imageUrl: initialData.imageUrl,
        category: initialData.category,
        brand: initialData.brand,
        price: initialData.price,
        stock: initialData.stock,
        rating: initialData.rating,
        featured: initialData.featured,
        active: initialData.active,
      });
    }
  }, [initialData]);

  // Sets current cursor position in context
  // Runs when opening/closing preview
  useEffect(() => {
    if (!preview && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        cursorPos.current, // starting position of cursor
        cursorPos.current // ending position of cursor (same as start for no selection)
      );
    }
  }, [preview]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cursorPos = useRef<number>(0);

  // Function to validate form input, returns true if valid, false if there are errors
  function validate() {
    const errs: string[] = [];

    if (!form.title.trim()) errs.push("Title is required");

    if (!form.description.trim()) {
      errs.push("Description is required");
    } else if (form.description.length > 200) {
      errs.push("Description is too long. Maximum is 200 characters");
    }

    if (!form.content.trim()) errs.push("Content is required");

    if (!form.imageUrl.trim()) {
      errs.push("Image URL is required");
    } else {
      try {
        new URL(form.imageUrl);
      } catch {
        errs.push("This is not a valid URL");
      }
    }

    if (!form.tags.trim()) {
      errs.push("At least one tag is required");
    }

    setErrors(errs);
    return errs.length === 0;
  }
  // Function to handle form input changes, updates form state with new values
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Save cursor position when switching between text area and markdown preview
  function togglePreview() {
    if (!preview && textareaRef.current) {
      cursorPos.current = textareaRef.current.selectionStart || 0;
    }
    // Toggle preview state on or off
    setPreview((prev) => !prev);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) {
      setSuccess("");
      return;
    }

    const res = await fetch(action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      ...form,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      rating: Number(form.rating || 0),

      featured: form.featured ?? false,
      active: form.active ?? true,
      }),
    });

    if (res.ok) {
      setErrors([]);
      if (initialData) {
        setSuccess("Product updated successfully");
      } else {
        setSuccess("Product created successfully");
      }
    } else {
      setSuccess("");
      setErrors(["Failed to create product"]);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      
      <h1 className="admin-title text-4xl mb-2 text-center">{title}</h1>

      <Link href="/">
        <button type="button" className="admin-btn mb-6">
          ← Back to Products List
        </button>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4">

        {errors.length > 0 && ( // if there are errors show error message and list of errors
          <div className="text-red-600">
            <p>Please fix the errors before saving</p>
            <ul>
              {errors.map((errorMsg, index) => ( // Loop through check errors
                <li key={index}>{errorMsg}</li>
              ))}
            </ul>
          </div>
        )}

        {success && <p className="text-green-600">{success}</p>}

        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="admin-input"
        />

        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="admin-input"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="admin-textarea"
        />

        <label htmlFor="content" className="block mt-2">
          Content
        </label>

        <button
          type="button"
          onClick={togglePreview}
          className="admin-btn block"
        >
          {preview ? "Close Preview" : "Preview"} 
        </button>

        {!preview ? (
          <textarea
            id="content"
            name="content"
            ref={textareaRef}
            value={form.content}
            onChange={handleChange}
            className="admin-textarea"
          />
        ) : (
          <div
            data-test-id="content-preview"
            className="border p-4 rounded"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {form.content}
            </ReactMarkdown>
          </div>
        )}

        <label htmlFor="brand">Brand</label>
        <input
          id="brand"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="admin-input"
        />

        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="admin-input"
        />

        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          className="admin-input"
        />

        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="admin-input"
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          className="admin-input"
        />

        <img
          data-test-id="image-preview"
          src={form.imageUrl || "https://via.placeholder.com/150"}
          alt="preview"
          className="w-full max-h-80 object-cover rounded"
        />

        <button type="submit" className="admin-btn">
          Save
        </button>
      </form>
    </div>
  );
}

/* - Original Post form with prisma
"use client";

import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import remarkGfm from "remark-gfm";
import Link from "next/link";

// props type for post form component
type Post = {
  title: string;
  description: string;
  content: string;
  tags: string;
  imageUrl: string;
  category: string;
};

export default function PostForm({
  initialData,
  action,
  title
}: {
  initialData?: Post;
  action: string;
  title: string;
}) {
  // Stores form input values
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    tags: "",
    imageUrl: "",
    category: "",
  });
  // Stores validation errors
  const [errors, setErrors] = useState<string[]>([]);
  // Toggles markdown preview
  const [preview, setPreview] = useState(false);
  // Shows success message
  const [success, setSuccess] = useState("");

  // Used when editing post, pre-fills form with existing data
  // Runs when initialData changes (e.g. when loading post to edit)
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        content: initialData.content,
        tags: initialData.tags,
        imageUrl: initialData.imageUrl,
        category: initialData.category,
      });
    }
  }, [initialData]);

  // Sets current cursor position in context
  // Runs when opening/closing preview
  useEffect(() => {
    if (!preview && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        cursorPos.current, // starting position of cursor
        cursorPos.current // ending position of cursor (same as start for no selection)
      );
    }
  }, [preview]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cursorPos = useRef<number>(0);

  // Function to validate form input, returns true if valid, false if there are errors
  function validate() {
    const errs: string[] = [];

    if (!form.title.trim()) errs.push("Title is required");

    if (!form.description.trim()) {
      errs.push("Description is required");
    } else if (form.description.length > 200) {
      errs.push("Description is too long. Maximum is 200 characters");
    }

    if (!form.content.trim()) errs.push("Content is required");

    if (!form.imageUrl.trim()) {
      errs.push("Image URL is required");
    } else {
      try {
        new URL(form.imageUrl);
      } catch {
        errs.push("This is not a valid URL");
      }
    }

    if (!form.tags.trim()) {
      errs.push("At least one tag is required");
    }

    setErrors(errs);
    return errs.length === 0;
  }
  // Function to handle form input changes, updates form state with new values
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Save cursor position when switching between text area and markdown preview
  function togglePreview() {
    if (!preview && textareaRef.current) {
      cursorPos.current = textareaRef.current.selectionStart || 0;
    }
    // Toggle preview state on or off
    setPreview((prev) => !prev);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) {
      setSuccess("");
      return;
    }

    const res = await fetch(action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setErrors([]);
      setSuccess("Post updated successfully");
    } else {
      setSuccess("");
      setErrors(["Failed to create post"]);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      
      <h1 className="admin-title text-4xl mb-2 text-center">{title}</h1>

      <Link href="/">
        <button type="button" className="admin-btn mb-6">
          ← Back to Posts List
        </button>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4">

        {errors.length > 0 && ( // if there are errors show error message and list of errors
          <div className="text-red-600">
            <p>Please fix the errors before saving</p>
            <ul>
              {errors.map((errorMsg, index) => ( // Loop through check errors
                <li key={index}>{errorMsg}</li>
              ))}
            </ul>
          </div>
        )}

        {success && <p className="text-green-600">{success}</p>}

        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="admin-input"
        />

        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="admin-input"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="admin-textarea"
        />

        <label htmlFor="content" className="block mt-2">
          Content
        </label>

        <button
          type="button"
          onClick={togglePreview}
          className="admin-btn block"
        >
          {preview ? "Close Preview" : "Preview"} 
        </button>

        {!preview ? (
          <textarea
            id="content"
            name="content"
            ref={textareaRef}
            value={form.content}
            onChange={handleChange}
            className="admin-textarea"
          />
        ) : (
          <div
            data-test-id="content-preview"
            className="border p-4 rounded"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {form.content}
            </ReactMarkdown>
          </div>
        )}

        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="admin-input"
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          className="admin-input"
        />

        <img
          data-test-id="image-preview"
          src={form.imageUrl || "https://via.placeholder.com/150"}
          alt="preview"
          className="w-full max-h-80 object-cover rounded"
        />

        <button type="submit" className="admin-btn">
          Save
        </button>
      </form>
    </div>
  );
}
*/
