import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";
/* 
test.describe("DETAIL SCREEN", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test(
    "Detail view",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      // DETAIL SCREEN > Detail page shows the same items as list item, but the short description is replaced by formatted long description

      const item = await page.getByTestId("blog-post-1");
      await expect(item).toBeVisible();

      await expect(item.getByText("Boost your conversion rate")).toBeVisible();
      await expect(
        item.getByText("Boost your conversion rate"),
      ).toHaveAttribute("href", "/post/boost-your-conversion-rate");

      await expect(item.getByText("Node")).toBeVisible();
      await expect(item.getByText("#Back-End")).toBeVisible();
      await expect(item.getByText("#Databases")).toBeVisible();
      await expect(item.getByText("18 Apr 2022")).toBeVisible();
      await expect(item.getByText("321 views")).toBeVisible();
      await expect(item.getByText("3 likes")).toBeVisible();

      // DETAIL SCREEN > Detail text is stored as Markdown, which needs to be converted to HTML
      await expect(
        await page.getByTestId("content-markdown").innerHTML(),
      ).toContain("<strong>sint voluptas</strong>");
    },
  );

  test(
    "Views increase on each view",
    {
      tag: "@a3",
    },
    async ({ page }) => {
      // BACKEND / CLIENT > Each visit of the page increases the post "views" count by one

      await page.goto("/post/boost-your-conversion-rate");
      await expect(page.getByText("321 views")).toBeVisible();
      await page.goto("/post/boost-your-conversion-rate");
      await expect(page.getByText("322 views")).toBeVisible();
    },
  );

  test(
    "Like posts",
    {
      tag: "@a3",
    },
    async ({ page }) => {
      // BACKEND / CLIENT > User can "like" the post on the detail screen, NOT on the list

      await page.goto("/post/boost-your-conversion-rate");
      await expect(page.getByText("3 likes")).toBeVisible();
      await page.getByTestId("like-button").click();
      await expect(page.getByText("4 likes")).toBeVisible();

      await page.goto("/post/boost-your-conversion-rate");
      await expect(page.getByText("4 likes")).toBeVisible();
      await page.getByTestId("like-button").click();
      await expect(page.getByText("3 likes")).toBeVisible();
    },
  );
});
*/

test.describe("DETAIL SCREEN", () => {
  test(
    "Product Detail View",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await expect(
        page.getByText("Wireless Headphones"),
      ).toBeVisible();

      await expect(
        page.getByText(/Premium wireless headphones/i),
      ).toBeVisible();

      await expect(
        page.getByText("$199 AUD"),
      ).toBeVisible();

      await expect(
        page.getByText(/SoundMax/i),
      ).toBeVisible();

      await expect(
        page.getByText(/12 Available/i),
      ).toBeVisible();

      await expect(
        page.getByText(/Audio,Wireless,Tech/i),
      ).toBeVisible();

      await expect(
        page.getByRole("button", { name: /add to cart/i }),
      ).toBeVisible();
    },
  );

  test(
    "Markdown Content Displays",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await expect(
        page.getByText("Active Noise Cancellation"),
      ).toBeVisible();

      await expect(
        page.getByText("USB-C Fast Charging"),
      ).toBeVisible();
    },
  );

  test(
    "Add Product To Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await expect(
        page.getByText(/item added to cart/i),
      ).toBeVisible();
    },
  );
});