import { seed } from "@repo/db/seed";
import { NextResponse } from "next/server";

export async function GET() {
  if (!process.env.E2E) {
    return new Response("Not Available", { status: 501 }); // 501 - not implemented
  }

  await seed(); //Seed file inserts fake/sample data into the database
  return NextResponse.json({ message: "Seeded" }, { status: 200 }); // 200 - success
}
