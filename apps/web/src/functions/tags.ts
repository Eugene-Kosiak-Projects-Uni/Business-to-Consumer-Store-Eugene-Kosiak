export async function tags(products: { tags: string; active: boolean }[]) {
  const map = new Map<string, number>(); // stores count for how many times a tag appears

  products
    .filter((p) => p.active) // filter active products
    .forEach((product) => {
      product.tags.split(",").forEach((tag) => {
        const t = tag.trim();
        map.set(t, (map.get(t) || 0) + 1); // count tags, if tag exists increment count, else set to 1
      });
    });

  return Array.from(map.entries()) // convert map to array of [name, count]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically by tag name
}

