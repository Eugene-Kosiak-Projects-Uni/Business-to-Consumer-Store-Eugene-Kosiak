import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";
import { prisma } from "@repo/db/prisma";
import { redirect } from "next/navigation";
import PurchaseList from "../components/PurchaseList";

export default async function PurchasesPage() {
  const token = (await cookies()).get("auth_token")?.value;
  // If no token, redirect to home page
  if (!token) {
    redirect("/");
  }

  try {
    jwt.verify(token, env.JWT_SECRET);
  } catch {
    redirect("/");
  }
  // Fetch all purchases with related user and product details, ordered by date (newest first)
  const purchases = await prisma.purchase.findMany({
    include: {
      user: true, // Include user details for each purchase

      items: {
        include: {
          product: true, // Include product details for each purchase item
        },
      },
    },

    orderBy: {
      date: "desc",
    },
  });

  return <PurchaseList purchases={purchases} />;
}