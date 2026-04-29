import { test, expect } from "@playwright/test";

const usersKey = "habit-tracker-users";
const sessionKey = "habit-tracker-session";
const habitsKey = "habit-tracker-habits";

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.setOffline(false);
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.clear();
    });
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await page.waitForURL("**/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await page.addInitScript(([sessionStorageKey]) => {
      window.localStorage.setItem(
        sessionStorageKey,
        JSON.stringify({ userId: "u1", email: "user@example.com" }),
      );
    }, [sessionKey]);

    await page.goto("/");
    await page.waitForURL("**/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill("signup@example.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await page.waitForURL("**/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await page.addInitScript(([uKey, hKey]) => {
      window.localStorage.setItem(
        uKey,
        JSON.stringify([
          {
            id: "u1",
            email: "user1@example.com",
            password: "password1",
            createdAt: "2026-04-29T00:00:00.000Z",
          },
          {
            id: "u2",
            email: "user2@example.com",
            password: "password2",
            createdAt: "2026-04-29T00:00:00.000Z",
          },
        ]),
      );

      window.localStorage.setItem(
        hKey,
        JSON.stringify([
          {
            id: "h1",
            userId: "u1",
            name: "Drink Water",
            description: "8 cups",
            frequency: "daily",
            createdAt: "2026-04-29T00:00:00.000Z",
            completions: [],
          },
          {
            id: "h2",
            userId: "u2",
            name: "Read Books",
            description: "10 pages",
            frequency: "daily",
            createdAt: "2026-04-29T00:00:00.000Z",
            completions: [],
          },
        ]),
      );
    }, [usersKey, habitsKey]);

    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill("user1@example.com");
    await page.getByTestId("auth-login-password").fill("password1");
    await page.getByTestId("auth-login-submit").click();
    await page.waitForURL("**/dashboard");

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
    await expect(page.getByTestId("habit-card-read-books")).toHaveCount(0);
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.addInitScript(([uKey, sKey]) => {
      window.localStorage.setItem(
        uKey,
        JSON.stringify([
          {
            id: "u1",
            email: "user@example.com",
            password: "password123",
            createdAt: "2026-04-29T00:00:00.000Z",
          },
        ]),
      );
      window.localStorage.setItem(
        sKey,
        JSON.stringify({ userId: "u1", email: "user@example.com" }),
      );
    }, [usersKey, sessionKey]);

    await page.goto("/dashboard");
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-description-input").fill("8 cups");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await page.addInitScript(([sKey, hKey]) => {
      window.localStorage.setItem(
        sKey,
        JSON.stringify({ userId: "u1", email: "user@example.com" }),
      );
      window.localStorage.setItem(
        hKey,
        JSON.stringify([
          {
            id: "h1",
            userId: "u1",
            name: "Drink Water",
            description: "8 cups",
            frequency: "daily",
            createdAt: "2026-04-29T00:00:00.000Z",
            completions: [],
          },
        ]),
      );
    }, [sessionKey, habitsKey]);

    await page.goto("/dashboard");
    await page.getByTestId("habit-complete-drink-water").click();
    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill("persist@example.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("**/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Read Books");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-read-books")).toBeVisible();

    await page.reload();
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-read-books")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.addInitScript(([sKey]) => {
      window.localStorage.setItem(
        sKey,
        JSON.stringify({ userId: "u1", email: "user@example.com" }),
      );
    }, [sessionKey]);

    await page.goto("/dashboard");
    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("**/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/login");
    await page.waitForTimeout(1000);

    await context.setOffline(true);
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
  });
});
