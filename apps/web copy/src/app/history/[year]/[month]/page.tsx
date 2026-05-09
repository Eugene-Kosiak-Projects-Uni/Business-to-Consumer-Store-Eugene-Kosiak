import { Main } from "@/components/Main";
import { prisma } from "@repo/db/prisma";

export default async function Page({
  params,
}: {
  // Page expects year and month from URL parameters
  params: Promise<{ year: string; month: string }>;
}) {
  // Get year and month from URL parameters
  const { year, month } = await params;
  // Convert month to a number (1-12)
  const monthNum = parseInt(month, 10);
  // Creates a date, converts month number - full name
  const monthName = new Date(Number(year), monthNum - 1)
    .toLocaleString("en-US", { month: "long" });
  // Create start and end dates for the month
  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 1);

  // Get posts that are active, and have a date within the specified month and year
  const filteredPosts = await prisma.post.findMany({
    where: {
      active: true,
      date: {
        gte: startDate, // greater than or equal to start
        lt: endDate, // less than end (exclusive)
      },
    },
    include: { // include the count of likes for each post
      _count: {
        select: { likes: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1
        title={`History / ${monthName}, ${year}`}
        data-test-id="history-title"
        className="text-3xl font-bold text-primary"
      >
        History / {monthName}, {year}
      </h1>

      {filteredPosts.length === 0 ? (
        <p data-test-id="no-posts" className="text-secondary">
          0 Posts
        </p>
      ) : (
        <Main posts={filteredPosts} />
      )}
    </div>
  );
}