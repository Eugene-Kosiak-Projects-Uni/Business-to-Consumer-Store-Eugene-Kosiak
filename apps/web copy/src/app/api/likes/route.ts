import { prisma } from "@repo/db/prisma";

export async function POST(request: Request) {

  // Read form data sent from frontend
  const formData = await request.formData();
  // Get postId from form and convert it to a number
  const postId = Number(formData.get("postId"));
  // Get action type: "like" or "unlike"
  const action = formData.get("action");

  // Get user's IP address (used to prevent multiple likes from same user)
  const ip =
    // get URL, split by comma if IP exists, take first one (in case of multiple IPs)
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown"; // fallback if IP not found

  if (action === "like") {
    try {
      // Create a like record in database - Liking the post
      await prisma.like.create({
        data: {
          postId, // which post is being liked
          userIP: ip, // who liked it (based on IP)
        },
      });
    } catch {
      // already liked - ignore
    }
  }

  if (action === "unlike") {
    try {
      // Delete like record matching postId and userIP - Disliking the post
      await prisma.like.delete({
        where: {
          postId_userIP: {
            postId,
            userIP: ip,
          },
        },
      });
    } catch {
      // not liked - ignore
    }
  }

  // Redirect user back to previous page after action
  return Response.redirect(request.headers.get("referer")!, 303);
}
