import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

export async function GET() {
  const token = (await cookies()).get("user_auth_token")?.value;

  if (!token) {
    return Response.json({ loggedIn: false });
  }

  try {
    jwt.verify(token, SECRET);
    return Response.json({ loggedIn: true });
  } catch {
    return Response.json({ loggedIn: false });
  }
}