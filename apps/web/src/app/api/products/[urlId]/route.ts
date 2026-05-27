import { prisma } from "@repo/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: { urlId: string } }
) {
  const product = await prisma.product.findFirst({
    where: {
      urlId: params.urlId,
      active: true,
    },
  });

  if (!product) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(product);
}