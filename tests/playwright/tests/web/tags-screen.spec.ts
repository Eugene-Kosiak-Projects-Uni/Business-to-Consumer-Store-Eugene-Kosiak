import { expect, test } from "./fixtures";
/* - Old tests from post data
test.describe("TAG SCREEN", () => {
  test(
    "Existing Tag with one post",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/tags/dev-tools");

      // TAG SCREEN > Displays posts with the tag url (e.g. /tags/dev-tools)

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(1);

      await expect(page.getByTestId("blog-post-3")).toBeVisible();
      await expect(
        page.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );

  test(
    "Existing Tag with multiple posts",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/tags/front-end");

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
    "Invalid Tag",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/abc");

      // TAG SCREEN > Displays "0 Posts" when search does no posts have that tag

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(0);

      await expect(page.getByText("0 Posts")).toBeVisible();
    },
  );
});
*/

test.describe("TAG SCREEN", () => {
  test("Existing Tag with one product", async ({ page }) => {
    await page.goto("/tags/wireless");

    const articles = await page.locator('[data-test-id^="b2c-"]');
    await expect(articles).toHaveCount(1);

    await expect(page.getByTestId("b2c-1")).toBeVisible();
    await expect(page.getByText("Wireless Headphones")).toBeVisible();
  });

  test("Existing Tag with multiple products", async ({ page }) => {
    await page.goto("/tags/gaming");

    const articles = await page.locator('[data-test-id^="b2c-"]');
    await expect(articles).toHaveCount(2);

    await expect(page.getByTestId("b2c-1")).toBeVisible(); // Wireless Headphones
    await expect(page.getByTestId("b2c-2")).toBeVisible(); // RGB Keyboard

    await expect(page.getByText("Wireless Headphones")).toBeVisible();
    await expect(page.getByText("RGB Gaming Keyboard")).toBeVisible();
  });

  test("Invalid Tag", async ({ page }) => {
    await page.goto("/tags/abc");

    const articles = await page.locator('[data-test-id^="b2c-"]');
    await expect(articles).toHaveCount(0);

    await expect(page.getByText("0 Products")).toBeVisible();
  });
});