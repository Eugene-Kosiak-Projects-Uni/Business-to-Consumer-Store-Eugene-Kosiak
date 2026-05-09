export function history(posts: { date: Date; active: boolean }[]) {
  // Step 1: filter active posts
  const activePosts = posts.filter((post) => post.active);

  // Step 2: sort posts by date (newest first)
  const sorted = activePosts.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Step 3: group and count BEFORE formatting
  const map = new Map<string, { month: number; year: number; count: number }>();

  sorted.forEach((post) => {
    const date = new Date(post.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { month, year, count: 1 });
    }
  });

  // Step 4: return grouped + sorted result
  return Array.from(map.values());
}