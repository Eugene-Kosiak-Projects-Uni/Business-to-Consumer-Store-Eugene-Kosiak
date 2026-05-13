import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

/* - Old tests from post data
test.describe("CATEGORY SCREEN", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test(
    "Existing Category",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/react");

      // CATEGORY SCREEN > Displays results based on category from url (e.g. /category/react)

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(2);

      await expect(page.getByTestId("blog-post-2")).toBeVisible();
      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await expect(page.getByTestId("blog-post-3")).toBeVisible();
      await expect(
        page.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );

  test(
    "Invalid Category",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/abc");

      // CATEGORY SCREEN > Displays "0 Posts" when search does not find anything

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(0);

      await expect(page.getByText("0 Posts")).toBeVisible();
    },
  );
});
*/
test.describe("CATEGORY SCREEN", () => {
  test("Electronics Category", async ({ page }) => {
    await page.goto("/category/electronics");

    const products = page.locator('[data-test-id^="b2c-"]');
    await expect(products).toHaveCount(2);

    await expect(page.getByTestId("b2c-1")).toBeVisible(); // Wireless Headphones
    await expect(page.getByTestId("b2c-3")).toBeVisible(); // Smart Watch Pro

    await expect(page.getByTestId("b2c-2")).not.toBeVisible();
  });

  test("Gaming Category", async ({ page }) => {
    await page.goto("/category/gaming");

    await expect(page.getByTestId("b2c-2")).toBeVisible(); // RGB Keyboard
  });

  test("Invalid Category", async ({ page }) => {
    await page.goto("/category/abc");

    await expect(page.getByText("0 Products")).toBeVisible();
  });
});