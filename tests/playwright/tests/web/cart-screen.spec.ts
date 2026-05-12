import { expect, test } from "./fixtures";

test.describe("CART SCREEN", () => {
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

      await page.goto("/cart");

      await expect(
        page.getByText("Wireless Headphones"),
      ).toBeVisible();

      await expect(
        page.getByText("$199 x 1"),
      ).toBeVisible();
    },
  );

  test(
    "Remove Product From Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await page.goto("/cart");

      await page.getByText("Remove").click();

      await expect(
        page.getByText("Cart is empty"),
      ).toBeVisible();
    },
  );

  test(
    "Mock Checkout",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await page.goto("/cart");

      await page
        .getByRole("button", { name: /mock checkout/i })
        .click();

      await expect(
        page.getByText(/payment successful/i),
      ).toBeVisible();

      await expect(
        page.getByText(/mock checkout complete/i),
      ).toBeVisible();
    },
  );
});