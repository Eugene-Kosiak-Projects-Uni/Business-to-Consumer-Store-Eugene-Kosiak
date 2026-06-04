import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

test.describe("ADMIN HOME SCREEN", () => {
  test(
    "Shows login screen",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Sign In", { exact: true })).toBeVisible();

      await expect(
        page.getByText("Sign in to your account", { exact: true }),
      ).toBeVisible();
    },
  );
/*
  test(
    "Can login",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");

      await page.getByLabel("Email", { exact: true }).fill("admin@test.com");
      await page.getByLabel("Password", { exact: true }).fill("admin123");
      await page.getByText("Sign In", { exact: true }).click();

      await expect(page.getByText("Admin of Products")).toBeVisible();

      const cookies = await page.context().cookies();
      const passwordCookie = cookies.find(
        (cookie) => cookie.name === "auth_token",
      );
      expect(passwordCookie).toBeDefined();

      await page.getByText("Logout").click();

      // wait for logout request to complete
      await page.waitForResponse((res) =>
        res.url().includes("/api/auth") && res.request().method() === "DELETE"
      );

      // wait for UI to settle back to login state
      await expect(
        page.getByText("Sign in to your account"),
      ).toBeVisible();

      await expect(page.locator("article")).toHaveCount(0);
    },
  );
*/

  test(
    "Can login",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");

      // fill login form
      await page.getByLabel("Email", { exact: true }).fill("admin@test.com");
      await page.getByLabel("Password", { exact: true }).fill("admin123");

      // IMPORTANT: wait for login + navigation together (like your working version)
      await Promise.all([
        page.waitForURL("/"),
        page.getByText("Sign In", { exact: true }).click(),
      ]);

      // ensure dashboard is loaded
      await expect(page.getByText("Admin of Products")).toBeVisible();

      // cookie exists (same as post test)
      const cookies = await page.context().cookies();
      const passwordCookie = cookies.find(
        (cookie) => cookie.name === "auth_token",
      );
      expect(passwordCookie).toBeDefined();

      // logout
      await Promise.all([
        page.waitForResponse((res) =>
          res.url().includes("/api/auth") &&
          res.request().method() === "DELETE"
        ),
        page.getByText("Logout").click(),
      ]);

      // back to login UI
      await expect(page.getByText("Sign in to your account")).toBeVisible();

      // no products visible
      await expect(page.locator("article")).toHaveCount(0);
    },
  );
  test(
    "Shows home screen to authorised user",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await expect(
        userPage.getByText("Admin of Products", { exact: true }),
      ).toBeVisible();

      await expect(await userPage.locator("article").count()).toBe(4);
    },
  );

  test(
    "Can navigate to purchase records page",
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

      await userPage.waitForURL("**/purchases");

      await expect(
        userPage.getByText("Purchase Records", {
          exact: true,
        })
      ).toBeVisible();
    },
  );
});



/* - Old tests from post data/code
test.describe("ADMIN HOME SCREEN", () => {
  test(
    "Shows login screen",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Sign In", { exact: true })).toBeVisible();

      // HOME SCREEN > Shows Login screen if not logged
      await expect(
        page.getByText("Sign in to your account", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Can login",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");

      // HOME SCREEN > Authenticate the current client using a hard-coded password
      await page.getByLabel("Password", { exact: true }).fill("123");
      await page.getByText("Sign In", { exact: true }).click();

      await expect(page.getByText("Admin of Full Stack Blog")).toBeVisible();

      // HOME SCREEN > Use a cookie to remember the signed-in state.
      const cookies = await page.context().cookies();
      const passwordCookie = cookies.find(
        (cookie) => cookie.name === "auth_token",
      );
      expect(passwordCookie).toBeDefined();

      // HOME SCREEN > There must be logout button
      await expect(page.getByText("Logout")).toBeVisible();

      //  HOME SCREEN > Clicking the logout button logs user out
      await page.getByText("Logout").click();

      await expect(await page.locator("article")).toHaveCount(0);
      await expect(page.getByText("Sign in to your account")).toBeVisible();
    },
  );

  test(
    "Shows home screen to authorised user",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // shows title
      await expect(
        userPage.getByText("Admin of Full Stack Blog", { exact: true }),
      ).toBeVisible();

      // LIST SCREEN > Article list is only accessible to logged-in users.
      await expect(await userPage.locator("article").count()).toBe(4);
    },
  );
});
*/