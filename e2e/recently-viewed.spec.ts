import { test, expect } from "@playwright/test";

test.describe("Recently Viewed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("should show empty state on recent page when no history", async ({ page }) => {
    await page.goto("/recent");
    await expect(page.getByText("No recently viewed Pokémon yet")).toBeVisible();
    await expect(page.getByRole("button", { name: "Explore Pokémon" })).toBeVisible();
  });

  test("should track viewed Pokémon automatically", async ({ page }) => {
    // 1. Visit a pokemon page
    await page.goto("/pokemon/bulbasaur");
    await expect(page.getByText("Bulbasaur", { exact: false })).toBeVisible();

    // 2. Visit another pokemon page
    await page.goto("/pokemon/charmander");
    await expect(page.getByText("Charmander", { exact: false })).toBeVisible();

    // 3. Check Recent page
    await page.goto("/recent");
    const cards = page.locator("article h3");
    await expect(cards.nth(0)).toHaveText(/charmander/i);
    await expect(cards.nth(1)).toHaveText(/bulbasaur/i);
    await expect(page.getByText("2 Pokémon in history")).toBeVisible();
  });

  test("should show history on home page", async ({ page }) => {
    // Setup history
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("recently-viewed-storage", JSON.stringify({
        state: {
          recentIds: [1, 4], // Bulbasaur, Charmander
          version: 1
        }
      }));
    });

    await page.goto("/");
    const section = page.getByText("Recently Viewed");
    await expect(section).toBeVisible();
    await expect(page.getByText("Bulbasaur", { exact: false })).toBeVisible();
    await expect(page.getByText("Charmander", { exact: false })).toBeVisible();
  });

  test("should search within history", async ({ page }) => {
    // Setup history
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("recently-viewed-storage", JSON.stringify({
        state: {
          recentIds: [1, 4, 7], // Bulbasaur, Charmander, Squirtle
          version: 1
        }
      }));
    });

    await page.goto("/recent");
    await expect(page.getByText("Bulbasaur", { exact: false })).toBeVisible();
    await expect(page.getByText("Charmander", { exact: false })).toBeVisible();

    const searchInput = page.getByPlaceholder("Search history...");
    await searchInput.fill("char");

    await expect(page.getByText("Charmander", { exact: false })).toBeVisible();
    await expect(page.getByText("Bulbasaur", { exact: false })).not.toBeVisible();
  });

  test("should clear history", async ({ page }) => {
    // Setup history
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("recently-viewed-storage", JSON.stringify({
        state: {
          recentIds: [1],
          version: 1
        }
      }));
    });

    await page.goto("/recent");
    await expect(page.getByText("Bulbasaur", { exact: false })).toBeVisible();

    await page.getByRole("button", { name: /clear history/i }).click();

    await expect(page.getByText("No recently viewed Pokémon yet")).toBeVisible();
  });
});
