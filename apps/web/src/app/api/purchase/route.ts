/*
import { prisma } from "@repo/db/prisma";

// Create a Purchase
export async function POST(req: Request) {
  const body = await req.json();

  // Calculates total pricing
  const total = body.cart.reduce(
    (sum: number, item: any) =>
      sum + item.price * item.quantity,
    0
  );

  // Create purchase
  const newPurchase = await prisma.purchase.create({
    data: {
      userId: 1, // mock customer
      total,

      items: {
        create: body.cart.map((item: any) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },

    include: {
      items: true,
    },
  });

  return Response.json(newPurchase);
}

// Get all purchases
export async function GET() {
  const purchases = await prisma.purchase.findMany({
    include: {
      items: true,
    },

    orderBy: {
      date: "desc",
    },
  });

  return Response.json(purchases);
}

// Remove purchase
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);

  // Reset purchase page when testing, both header and url contains reset, to properly reset
  const isTestReset =
    req.headers.get("x-test-reset") === "true" &&
    searchParams.get("reset") === "true";

  if (isTestReset) {
    await prisma.purchaseItem.deleteMany();
    await prisma.purchase.deleteMany();

    return Response.json({ reset: true });
  }

  // get id from URL and converts to number
  const id = Number(searchParams.get("id"));

  const purchase = await prisma.purchase.findUnique({
    where: {
      id,
    },
  });

  if (!purchase) {
    return Response.json(
      { error: "Purchase not found" },
      { status: 404 }
    );
  }

  await prisma.purchase.delete({
    where: {
      id,
    },
  });

  return Response.json({ success: true });
}
*/

import { prisma } from "@repo/db/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

// --------------------
// GET PURCHASES
// --------------------
export async function GET() {
  try {
    const token = (await cookies()).get("user_auth_token")?.value;

    // Must be logged in
    if (!token) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode JWT
    const decoded = jwt.verify(token, SECRET) as {
      id: number;
      email: string;
      role: string;
    };

    // ONLY purchases for this user
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: decoded.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return Response.json(purchases);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}

// --------------------
// CREATE PURCHASE
// --------------------
export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("user_auth_token")?.value;

    // User must be logged in
    if (!token) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode JWT
    const decoded = jwt.verify(token, SECRET) as {
      id: number;
      email: string;
      role: string;
    };

    const body = await req.json();

    const cart = body.cart || [];

    if (!cart.length) {
      return Response.json(
        { error: "Cart empty" },
        { status: 400 }
      );
    }

    const total = cart.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );

    const purchase = await prisma.purchase.create({
      data: {
        userId: decoded.id,

        total,

        items: {
          create: cart.map((item: any) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },

      include: {
        items: true,
      },
    });

    return Response.json(purchase);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to create purchase" },
      { status: 500 }
    );
  }
}

// --------------------
// DELETE PURCHASE
// --------------------
export async function DELETE(req: Request) {
  try {
    const token = (await cookies()).get("user_auth_token")?.value;

    if (!token) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, SECRET) as {
      id: number;
    };

    const { searchParams } = new URL(req.url);

    // Reset route for tests
    if (searchParams.get("reset")) {
      await prisma.purchaseItem.deleteMany({
        where: {
          purchase: {
            userId: decoded.id,
          },
        },
      });

      await prisma.purchase.deleteMany({
        where: {
          userId: decoded.id,
        },
      });

      return Response.json({ success: true });
    }

    const id = Number(searchParams.get("id"));

    const purchase = await prisma.purchase.findFirst({
      where: {
        id,
        userId: decoded.id,
      },
    });

    if (!purchase) {
      return Response.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    await prisma.purchase.delete({
      where: {
        id,
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to delete purchase" },
      { status: 500 }
    );
  }
}