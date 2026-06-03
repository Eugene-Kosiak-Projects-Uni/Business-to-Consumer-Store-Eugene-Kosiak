import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

async function login(page: any) {
  await page.goto("/login");

  await page.getByPlaceholder("Enter email").fill("user@test.com");
  await page.getByPlaceholder("Enter password").fill("user123");

  await page.getByRole("button", { name: /login/i }).click();

  await page.waitForURL("/");
}

test.beforeAll(async () => {
  await seed();
});

test.describe("PURCHASES SCREEN", () => {

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();

    await page.goto("/api/seed");

    await login(page);

    await page.evaluate(async () => {
      await fetch("/api/purchase?reset=true", {
        method: "DELETE",
      });
    });
  });

  test(
    "Displays purchases after checkout",
    { 
      tag: "@a1" 
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");
      await page.getByRole("button", { name: /add to cart/i }).click();

      // ✅ Create purchase correctly
      await page.request.post("/api/purchase", {
        data: {
          cart: [
            {
              id: 1,
              title: "Wireless Headphones",
              price: 100,
              quantity: 1,
            },
          ],
        },
      });

      await page.goto("/purchases");

      await expect(page.getByTestId("purchase-item")).toHaveCount(1);

      await expect(page.getByText(/wireless headphones/i)).toBeVisible();
    }
  );

  test(
    "Can remove purchase and show toast",
    { 
      tag: "@a1" 
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page.getByRole("button", { name: /add to cart/i }).click();

      await page.request.post("/api/purchase", {
        data: {
          cart: [
            {
              id: 1,
              title: "Wireless Headphones",
              price: 100,
              quantity: 1,
            },
          ],
        }
      });

      await page.goto("/purchases");

      await expect(page.getByTestId("purchase-item").first()).toBeVisible();

      await page.getByRole("button", { name: "Remove" }).click();

      await expect(page.getByTestId("purchase-item")).toHaveCount(0);

      await expect(
        page.getByText("Purchase removed successfully")
      ).toBeVisible();
    }
  );

  test(
    "Shows error toast when API fails",
    { 
      tag: "@a1" 
    },
    async ({ page }) => {
      await page.route("**/api/purchase*", async (route) => {
        if (route.request().method() === "DELETE") {
          await route.fulfill({
            status: 404,
            contentType: "application/json",
            body: JSON.stringify({ error: "Purchase not found" }),
          });
        } else {
          await route.continue();
        }
      });

      await page.goto("/product/wireless-headphones");

      await page.getByRole("button", { name: /add to cart/i }).click();

      await page.request.post("/api/purchase", {
        data: {
          cart: [
            {
              id: 1,
              title: "Wireless Headphones",
              price: 100,
              quantity: 1,
            },
          ],
        }
      });

      await page.goto("/purchases");

      await expect(page.getByTestId("purchase-item").first()).toBeVisible();

      await page.getByRole("button", { name: "Remove" }).click();

      await expect(page.getByText("Failed to remove purchase")).toBeVisible();
    }
  );
});