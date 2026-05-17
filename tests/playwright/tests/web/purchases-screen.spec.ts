import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

test.describe("PURCHASES SCREEN", () => {

  test.beforeEach(async ({ request }) => {
    await request.delete("/api/purchase?reset=true");
  });

  /* - Still need to fix
  test(
    "Displays purchases after checkout",
    {
      tag: "@a1",
    },
    async ({ page, request }) => {
      await request.post("/api/purchase", {
        data: {
          cart: [
            { id: 1, title: "Wireless Headphones", price: 199, quantity: 2 },
          ],
        },
      });

      await page.goto("/purchases");

      const purchase = page.locator("div.border", {
        hasText: "Wireless Headphones",
      });

      await expect(purchase).toBeVisible();
      await expect(purchase.getByText("× 2")).toBeVisible();
      await expect(purchase.getByText("$398")).toBeVisible();
    },
  );
  */

  test(
    "Can remove purchase and show toast",
    {
      tag: "@a1",
    },
    async ({ page, request }) => {
      await request.post("/api/purchase", {
        data: {
          cart: [
            { id: 2, title: "Gaming Keyboard", price: 149, quantity: 1 },
          ],
        },
      });

      await page.goto("/purchases");

      const purchase = page.locator("div.border", {
        hasText: "Gaming Keyboard",
      });

      await purchase.getByRole("button", { name: "Remove" }).click();

      await expect(purchase).not.toBeVisible();

      await expect(
        page.getByText("Purchase removed successfully"),
      ).toBeVisible();
    },
  );

  test(
    "Shows error toast when API fails",
    {
      tag: "@a1",
    },
    async ({ page, request }) => {
      await request.post("/api/purchase", {
        data: {
          cart: [
            { id: 3, title: "Mouse", price: 50, quantity: 1 },
          ],
        },
      });

      await page.route("**/api/purchase*", async (route) => {
        if (route.request().method() === "DELETE") {
          await route.fulfill({
            status: 404,
            body: JSON.stringify({ error: "Purchase not found" }),
          });
        } else {
          await route.continue();
        }
      });

      await page.goto("/purchases");

      const purchase = page.locator("div.border").first();
      await purchase.getByRole("button", { name: "Remove" }).click();

      await expect(
        page.getByText("Failed to remove purchase"),
      ).toBeVisible();
    },
  );
});