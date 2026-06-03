import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeEach(async () => {
  await seed();
});

test.describe("ADMIN PURCHASE RECORDS", () => {
  test(
    "Purchase page requires authentication",
    {
      tag: "@a3",
    },
    async ({ page }) => {
      await page.goto("/purchases");

      await expect(
        page.getByText("Sign in to your account", {
          exact: true,
        })
      ).toBeVisible();
    }
  );

  test(
    "Admin can navigate to View Purchase records page",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await expect(
        userPage.getByText("View Purchases")
      ).toBeVisible();

      await userPage
        .locator('a:has-text("View Purchases")')
        .click();

      await expect(userPage).toHaveURL("/purchases");

      await expect(
        userPage.getByText("Purchase Records", {
          exact: true,
        })
      ).toBeVisible();
    }
  );

  test(
    "Displays purchase information",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/purchases");

      await expect(
        userPage.getByText(/Purchase #/)
      ).toBeVisible();

      await expect(
        userPage.getByText(/Customer:/)
      ).toBeVisible();

      await expect(
        userPage.getByText(/Email:/)
      ).toBeVisible();

      await expect(
        userPage.getByText(/Total:/)
      ).toBeVisible();

      await expect(
        userPage.getByText("Purchased Items")
      ).toBeVisible();
    }
  );

  test(
    "Displays purchased products with images",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/purchases");

      const images = userPage.locator("img");

      await expect(images.first()).toBeVisible();

      await expect(
        userPage.getByText("Wireless Headphones")
      ).toBeVisible();
    }
  );

  test(
    "Displays item quantity and totals",
    {
        tag: "@a3",
    },
    async ({ userPage }) => {
        await userPage.goto("/purchases");

        await expect(
        userPage.getByText(/Quantity:/).first()
        ).toBeVisible();

        await expect(
        userPage.getByText(/Total:/).first()
        ).toBeVisible();
    }
    );

  test(
    "Can return to dashboard",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/purchases");

      await userPage.getByText("← Back to Dashboard").click();

      await expect(userPage).toHaveURL("/");

      await expect(
        userPage.getByText("Admin of Products")
      ).toBeVisible();
    }
  );
});