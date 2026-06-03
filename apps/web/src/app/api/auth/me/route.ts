import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

export async function GET() {
  const token = (await cookies()).get("user_auth_token")?.value;

  if (!token) {
    return Response.json({
      loggedIn: false,
    });
  }

  try {
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
  } catch {
    return Response.json({
      loggedIn: false,
    });
  }
}