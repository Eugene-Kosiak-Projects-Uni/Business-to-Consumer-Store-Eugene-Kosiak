"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <input
      type="text"
      placeholder="Search"
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        setValue(val);
        router.push(`/search?q=${val}`);
      }}
      className="border rounded px-3 py-2 w-64
        bg-white text-gray-900 border-black
        dark:bg-gray-900 dark:text-white dark:border-white"
    />
  );
}
