"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await fetch("/api/auth", {
          method: "DELETE",
        });

        router.push("/login");
        router.refresh();
      }}
      className="text-red-600 font-semibold hover:underline"
    >
      Logout
    </button>
  );
}