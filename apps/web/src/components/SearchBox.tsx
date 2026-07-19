"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  // Initialize router and state for the search input
  const router = useRouter();
  // State to hold the current value of the search input
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
