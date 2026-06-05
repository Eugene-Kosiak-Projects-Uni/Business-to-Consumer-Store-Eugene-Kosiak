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
    // Read cart items from request body
    const body = await req.json();

    // Validate cart items
    const cart = body.cart || [];

    if (!cart.length) {
      return Response.json(
        { error: "Cart empty" },
        { status: 400 }
      );
    }

    // Calculate total price from cart items
    const total = cart.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );

    // Create purchase record in purchase database with associated items
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
    // Read JWT Cookie and check login
    const token = (await cookies()).get("user_auth_token")?.value;

    if (!token) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode JWT to check if the token is valid
    const decoded = jwt.verify(token, SECRET) as {
      id: number;
    };

    // Get purchase ID from query parameters
    const { searchParams } = new URL(req.url);

    // Reset route for tests
    if (searchParams.get("reset")) {
      // Deletes all purchases for this user (and associated items)
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

    // Find purchase with this ID AND owned by this customer
    const purchase = await prisma.purchase.findFirst({
      where: {
        id,
        userId: decoded.id, // only delete if this purchase belongs to the logged in user
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