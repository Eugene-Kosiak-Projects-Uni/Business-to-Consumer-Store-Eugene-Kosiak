import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

// Read current user's authentication status from JWT cookie
export async function GET() {
  const token = (await cookies()).get("user_auth_token")?.value;

  if (!token) {
    return Response.json({
      loggedIn: false,
    });
  }

  try {
    // Decode token and return user details
    const decoded = jwt.verify(token, SECRET) as {
      id: number;
      name: string;
      email: string;
      role: string;
    };

    return Response.json({
      loggedIn: true,
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch { // Invalid/expired token, treat as not logged in
    return Response.json({
      loggedIn: false,
    });
  }
}