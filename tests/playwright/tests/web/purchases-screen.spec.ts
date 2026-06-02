import { seed } from "@repo/db/seed";
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

test.beforeAll(async () => {
  await seed();
});

test.describe("PURCHASES SCREEN", () => {

  test.beforeEach(async ({ page }) => {

    await page.context().clearCookies();
    
    // reset database
    await page.goto("/api/seed");

    // login FIRST so reset route has auth cookie
    await login(page);

    // reset purchases for current logged in user
    await page.evaluate(async () => {
      await fetch("/api/purchase?reset=true", {
        method: "DELETE",
      });
    });
  });

  test(
    "Displays purchases after checkout",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      // IMPORTANT: do NOT navigate away immediately
      await page.waitForTimeout(500);

      await page.goto("/cart");

      await expect(
        page.getByText("Wireless Headphones")
      ).toBeVisible();

      await page
        .getByRole("button", { name: /checkout/i })
        .click();

      await expect(
        page.getByText(/payment successful/i)
      ).toBeVisible();

      await page.goto("/purchases");

      const purchase = page.locator("div.border", {
        hasText: "Wireless Headphones",
      });

      await expect(purchase).toBeVisible();
      await expect(
        purchase.getByText("× 1")
      ).toBeVisible();

      await expect(
        purchase.getByText("Total: $199")
      ).toBeVisible();
    }
  );

  test(
    "Can remove purchase and show toast",
    {
      tag: "@a1",
    },
    async ({ page }) => {

      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", {
          name: /add to cart/i,
        })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      // wait for cart local storage/state
      await page.waitForTimeout(500);

      await page.goto("/cart");

      // ensure item exists before checkout
      await expect(
        page.getByText("Wireless Headphones")
      ).toBeVisible();

      const checkoutButton = page.getByRole(
        "button",
        {
          name: /checkout/i,
        }
      );

      await expect(checkoutButton).toBeVisible();

      await checkoutButton.click();

      await expect(
        page.getByText(/payment successful/i)
      ).toBeVisible();

      await page.goto("/purchases");

      const purchase = page.getByTestId("purchase-item").first();

      await expect(purchase).toBeVisible();

      await purchase
        .getByRole("button", {
          name: "Remove",
        })
        .click();

      await expect(page.getByTestId("purchase-item")).toHaveCount(0);

      await expect(
        page.getByText(
          "Purchase removed successfully"
        ),
      ).toBeVisible();
    },
  );

  test(
    "Shows error toast when API fails",
    {
      tag: "@a1",
    },
    async ({ page }) => {

      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", {
          name: /add to cart/i,
        })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      // wait for cart local storage/state
      await page.waitForTimeout(500);

      await page.goto("/cart");

      // ensure item exists before checkout
      await expect(
        page.getByText("Wireless Headphones")
      ).toBeVisible();

      const checkoutButton = page.getByRole(
        "button",
        {
          name: /checkout/i,
        }
      );

      await expect(checkoutButton).toBeVisible();

      await checkoutButton.click();

      await expect(
        page.getByText(/payment successful/i)
      ).toBeVisible();

      await page.route(
        "**/api/purchase*",
        async (route) => {
          if (
            route.request().method() === "DELETE"
          ) {
            await route.fulfill({
              status: 404,
              body: JSON.stringify({
                error: "Purchase not found",
              }),
            });
          } else {
            await route.continue();
          }
        }
      );

      await page.goto("/purchases");

      const purchase = page
        .locator("div.border")
        .first();

      await expect(purchase).toBeVisible();

      await purchase
        .getByRole("button", {
          name: "Remove",
        })
        .click();

      await expect(
        page.getByText(
          "Failed to remove purchase",
        ),
      ).toBeVisible();
    },
  );
});