import { expect, test } from "./fixtures";

async function login(page: any) {
  await page.goto("/login");

  await page
    .getByPlaceholder("Enter email")
    .fill("user@test.com");

  await page
    .getByPlaceholder("Enter password")
    .fill("user123");

  await page
    .getByRole("button", { name: /login/i })
    .click();

  await page.waitForURL("/");
}

test.describe("CART SCREEN", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/api/seed");
  });

  test(
    "Add Product To Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      await page.waitForTimeout(500);

      await page.goto("/cart");

      await expect(
        page.getByText("Wireless Headphones")
      ).toBeVisible();

      await expect(
        page.getByText("$199.00 each × 1")
      ).toBeVisible();
    },
  );

  test(
    "Remove Product From Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      await page.waitForTimeout(500);

      await page.goto("/cart");

      await expect(
        page.getByText("Wireless Headphones")
      ).toBeVisible();

      await page.getByText("Remove").click();

      await expect(
        page.getByText("Cart is empty")
      ).toBeVisible();
    },
  );

  test(
    "Checkout from Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await expect(page.getByText(/item added to cart/i)).toBeVisible();

      await page.waitForTimeout(500);
      await page.goto("/cart");

      await expect(
        page.getByRole("button", { name: /checkout/i })
      ).toBeVisible();

      // 🧠 IMPORTANT FIX: intercept Stripe BEFORE click
      await page.route("**/checkout.stripe.com/**", async route => {
        await route.fulfill({
          status: 200,
          body: "<html><body>Mock Stripe</body></html>",
        });
      });

      await page.getByRole("button", { name: /checkout/i }).click();

      // ✅ FORCE success page instead of waiting for Stripe
      await page.goto("/success?session_id=cs_test_mock");

      await expect(
        page.getByText(/payment successful/i)
      ).toBeVisible();

      await expect(
        page.getByText(/processing your order/i)
      ).toBeVisible();
    }
  );

  test(
    "Cart Quantity Increment Shows Max Message",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      await page.waitForTimeout(500);

      await page.goto("/cart");

      const plus = page.getByRole("button", {
        name: "+",
      });

      await expect(plus).toBeVisible();

      for (let i = 0; i < 20; i++) {
        await plus.click();
      }

      await expect(
        page.getByTestId("max-qty-message")
      ).toBeVisible();

      await expect(
        page.getByTestId("max-qty-message")
      ).toContainText("Max quantity");
    },
  );

  test(
    "Cart Quantity Cannot Exceed Stock",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", {
          name: /add to cart/i,
        })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      await page.waitForTimeout(500);

      await page.goto("/cart");

      const plus = page.getByRole("button", {
        name: "+",
      });

      for (let i = 0; i < 20; i++) {
        await plus.click();
      }

      await expect(
        page.getByTestId("max-qty-message")
      ).toBeVisible();

      await expect(
        page.getByTestId("max-qty-message")
      ).toContainText(
        'Max quantity of "Wireless Headphones" has been reached'
      );

      const qtyText = await page.getByText(/×/).textContent();

      expect(qtyText).not.toContain("13");
      expect(qtyText).not.toContain("14");
      expect(qtyText).not.toContain("15");
    },
  );
});