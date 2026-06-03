import { expect, test } from "./fixtures";

test.describe("REGISTER SCREEN", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/api/seed");
  });

  test(
    "Register Screen Loads",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/register");

      await expect(
        page.getByRole("heading", {
          name: /create account/i,
        })
      ).toBeVisible();

      await expect(
        page.getByPlaceholder("Enter name")
      ).toBeVisible();

      await expect(
        page.getByPlaceholder("Enter email")
      ).toBeVisible();

      await expect(
        page.getByPlaceholder("Enter password")
      ).toBeVisible();

      await expect(
        page.getByRole("button", {
          name: /register/i,
        })
      ).toBeVisible();
    },
  );

  test(
    "User Can Register Successfully",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/register");

      await page
        .getByPlaceholder("Enter name")
        .fill("Eugene");

      await page
        .getByPlaceholder("Enter email")
        .fill("eugene@test.com");

      await page
        .getByPlaceholder("Enter password")
        .fill("test");

      await page
        .getByRole("button", {
          name: /register/i,
        })
        .click();

      await expect(page).toHaveURL(
        /success=true/
      );

      await expect(
        page.getByText(
          /account created successfully/i
        )
      ).toBeVisible();
    },
  );

  test(
    "Existing User Cannot Register Again",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/register");

      // Existing seeded user
      await page
        .getByPlaceholder("Enter name")
        .fill("Existing User");

      await page
        .getByPlaceholder("Enter email")
        .fill("user@test.com");

      await page
        .getByPlaceholder("Enter password")
        .fill("test");

      await page
        .getByRole("button", {
          name: /register/i,
        })
        .click();

      await expect(page).toHaveURL(
        /error=exists/
      );

      await expect(
        page.getByText(
          /already exists/i
        )
      ).toBeVisible();
    },
  );

  test(
    "New User Can Login After Registering",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      // Register
      await page.goto("/register");

      await page
        .getByPlaceholder("Enter name")
        .fill("Eugene");

      await page
        .getByPlaceholder("Enter email")
        .fill("newuser@test.com");

      await page
        .getByPlaceholder("Enter password")
        .fill("test");

      await page
        .getByRole("button", {
          name: /register/i,
        })
        .click();

      await expect(
        page.getByText(
          /account created successfully/i
        )
      ).toBeVisible();

      // Login
      await page.goto("/login");

      await page
        .getByPlaceholder("Enter email")
        .fill("newuser@test.com");

      await page
        .getByPlaceholder("Enter password")
        .fill("test");

      await page
        .getByRole("button", {
          name: /login/i,
        })
        .click();

      await page.waitForURL("/");

      // Greeting
      await expect(
        page.getByText("Hi Eugene")
      ).toBeVisible();
    },
  );

  test(
    "Register Fields Are Required",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/register");

      await page
        .getByRole("button", {
          name: /register/i,
        })
        .click();

      // Browser validation stops submit
      await expect(page).toHaveURL(
        /register/
      );
    },
  );
});
