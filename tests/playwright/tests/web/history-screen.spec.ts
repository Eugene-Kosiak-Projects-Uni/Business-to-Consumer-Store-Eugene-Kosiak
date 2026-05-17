import { expect, test } from "./fixtures";
/* - Old tests from post data
test.describe("HISTORY SCREEN", () => {
  test(
    "Existing history",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/history/2024/12");

      // HISTORY SCREEN > Displays posts from year and month specified in the url (e.g. /history/2024/12)

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(1);

      await expect(page.getByTestId("blog-post-3")).toBeVisible();
      await expect(
        page.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );

  test(
    "Invalid History",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/history/2024/1");

      // HISTORY SCREEN > Displays "0 Posts" when search does not find anything

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(0);

      await expect(page.getByText("0 Posts")).toBeVisible();
    },
  );
});
*/
test.describe("HISTORY SCREEN", () => {
  test(
    "January 2025 History",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/history/2025/1");

      // Running Shoes is in Jan 2025
      await expect(
        page.getByRole("link", { name: "Running Shoes" }),
      ).toBeVisible();
    },
  );

  test(
    "February 2025 History",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/history/2025/2");

      // Wireless Headphones is in Feb 2025
      await expect(
        page.getByRole("link", { name: "Wireless Headphones" }),
      ).toBeVisible();
    },
  );

  test(
    "November 2024 History",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/history/2024/11");

      // RGB Keyboard is in Nov 2024
      await expect(
        page.getByRole("link", { name: "RGB Gaming Keyboard" }),
      ).toBeVisible();
    },
  );

  test(
    "Invalid History",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/history/2024/1");

      await expect(
        page.getByText("0 Products"),
      ).toBeVisible();
    },
  );
});