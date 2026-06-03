import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";
import { prisma } from "@repo/db/prisma";
import { redirect } from "next/navigation";
import PurchaseList from "../components/PurchaseList";

export default async function PurchasesPage() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    jwt.verify(token, env.JWT_SECRET);
  } catch {
    redirect("/");
  }

  const purchases = await prisma.purchase.findMany({
    include: {
      user: true,

      items: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      date: "desc",
    },
  });

  return <PurchaseList purchases={purchases} />;
}