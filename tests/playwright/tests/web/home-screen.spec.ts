import { seed } from "@repo/db/seed";
import { expect, test, type Page } from "./fixtures";

test.describe("HOME SCREEN", () => {
  async function checkCategory(
    page: Page,
    name: string,
    link: string,
    count?: number,
  ) {
    const linkItem = page.getByTitle(`Category / ${name}`);

    await expect(linkItem).toBeVisible();
    await expect(linkItem).toHaveAttribute("href", link);

    if (count !== undefined) {
      await expect(linkItem).toContainText(count.toString());
    }
  }

  test(
    "Show Active Products",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      await expect(page.getByTestId("b2c-1")).toBeVisible();
      await expect(page.getByTestId("b2c-2")).toBeVisible();
      await expect(page.getByTestId("b2c-3")).toBeVisible();
      await expect(page.getByTestId("b2c-4")).toBeVisible();
    },
  );

  test(
    "Category Links",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      await checkCategory(
        page,
        "Electronics",
        "/category/electronics",
        2,
      );

      await checkCategory(
        page,
        "Gaming",
        "/category/gaming",
        1,
      );

      await checkCategory(
        page,
        "Clothing",
        "/category/clothing",
        1,
      );
    },
  );

  test(
    "Cart Link",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      const cartLink = page.getByRole("link", {
        name: /cart/i,
      });

      await expect(cartLink).toBeVisible();
      await expect(cartLink).toHaveAttribute("href", "/cart");
    },
  );

  test(
    "Dark Mode Switch",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      const html = await page.getAttribute("html", "data-theme");

      if (html === "dark") {
        await page.getByText(/light mode/i).click();

        await expect(
          await page.getAttribute("html", "data-theme"),
        ).toBe("light");
      } else {
        await page.getByText(/dark mode/i).click();

        await expect(
          await page.getAttribute("html", "data-theme"),
        ).toBe("dark");
      }
    },
  );

  test(
    "Search Box",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      await page.getByPlaceholder("Search").fill("headphones");

      await expect(page).toHaveURL("/search?q=headphones");
    },
  );
});
