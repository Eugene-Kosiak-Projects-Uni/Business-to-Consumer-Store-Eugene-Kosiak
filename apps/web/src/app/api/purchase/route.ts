import { prisma } from "@repo/db/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Secret used to verify JWT tokens
const SECRET = process.env.JWT_SECRET || "user-secret-key";

// --------------------
// GET PURCHASES
// --------------------
export async function GET() {
  try {
    // Read auth token from cookies
    const token = (await cookies()).get("user_auth_token")?.value;

    // Will store authenticated user ID if found
    let userId: number | null = null;

    if (token) {
      // Decode and verify JWT token
      const decoded = jwt.verify(token, SECRET) as { id: number };

      // Extract user ID from token
      userId = decoded.id;
    }

    if (!userId && process.env.E2E === "true") {
      // Find test user in database
      const testUser = await prisma.user.findUnique({
        where: { email: "user@test.com" },
      });

      // Use test user ID if found
      if (testUser) {
        userId = testUser.id;
      }
    }

    // If no user found, reject request
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all purchases belonging to user
    const purchases = await prisma.purchase.findMany({
      where: { userId },

      // Include related purchase items
      include: { items: true },

      // Sort newest purchases first
      orderBy: { date: "desc" },
    });

    // Return purchases as JSON
    return Response.json(purchases);
  } catch (error) {
    // Log server error
    console.error(error);

    // Return generic error response
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
    // Get auth token from cookies
    const token = (await cookies()).get("user_auth_token")?.value;

    // Store authenticated user ID
    let userId: number | null = null;

    // Verify JWT token if present
    if (token) {
      const decoded = jwt.verify(token, SECRET) as { id: number };

      // Extract user ID
      userId = decoded.id;
    }

    // E2E fallback authentication for tests
    if (!userId && process.env.E2E === "true") {
      const testUser = await prisma.user.findUnique({
        where: { email: "user@test.com" },
      });

      if (testUser) {
        userId = testUser.id;
      }
    }

    // Reject if no valid user
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body (cart data)
    const body = await req.json();

    // Extract cart array
    const cart = body.cart || [];

    // Reject empty cart
    if (!cart.length) {
      return Response.json({ error: "Cart empty" }, { status: 400 });
    }

    // Calculate total price of cart
    const total = cart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Create purchase in database
    const purchase = await prisma.purchase.create({
      data: {
        userId, // link purchase to user
        total,  // store total cost

        // Create purchase items linked to purchase
        items: {
          create: await Promise.all(
            cart.map(async (item: any) => {
              // Fetch product for image fallback
              const product = await prisma.product.findUnique({
                where: { id: item.id },
              });

              return {
                productId: item.id,
                title: item.title,
                price: item.price,

                // Use provided image or fallback to DB or empty string
                imageUrl: item.imageUrl || product?.imageUrl || "",

                quantity: item.quantity,
              };
            })
          ),
        },
      },

      // Return purchase with items included
      include: { items: true },
    });

    // Return created purchase
    return Response.json(purchase);
  } catch (error) {
    // Log error
    console.error(error);

    // Return failure response
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
    // Get auth token
    const token = (await cookies()).get("user_auth_token")?.value;

    // Store user ID
    let userId: number | null = null;

    // Verify JWT
    if (token) {
      const decoded = jwt.verify(token, SECRET) as { id: number };
      userId = decoded.id;
    }

    // E2E fallback user
    if (!userId && process.env.E2E === "true") {
      const testUser = await prisma.user.findUnique({
        where: { email: "user@test.com" },
      });

      if (testUser) {
        userId = testUser.id;
      }
    }

    // Reject if unauthorized
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters from URL
    const { searchParams } = new URL(req.url);

    // --------------------
    // Reset route for testing (delete ALL user purchases)
    // --------------------
    if (searchParams.get("reset")) {
      // Delete all purchase items for user
      await prisma.purchaseItem.deleteMany({
        where: { purchase: { userId } },
      });

      // Delete all purchases for user
      await prisma.purchase.deleteMany({
        where: { userId },
      });

      return Response.json({ success: true });
    }

    // Get purchase ID from query string
    const id = Number(searchParams.get("id"));

    // Check purchase belongs to user
    const purchase = await prisma.purchase.findFirst({
      where: { id, userId },
    });

    // If not found, return error
    if (!purchase) {
      return Response.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    // Delete purchase from database
    await prisma.purchase.delete({
      where: { id },
    });

    // Return success response
    return Response.json({ success: true });
  } catch (error) {
    // Log error
    console.error(error);

    // Return failure response
    return Response.json(
      { error: "Failed to delete purchase" },
      { status: 500 }
    );
  }
}