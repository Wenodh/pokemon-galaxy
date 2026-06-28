import { test, expect } from "@playwright/test";

test.describe("Favorites Page", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start with no favorites
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("should show empty state when no favorites", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page.getByText("No favorites yet")).toBeVisible();
    await expect(page.getByRole("button", { name: "Explore Pokémon" })).toBeVisible();
  });

  test("should add a favorite and see it on the favorites page", async ({ page }) => {
    // 1. Go to Pokedex and favorite a pokemon
    await page.goto("/pokedex");

    // Wait for cards to load
    const firstCard = page.locator("article").first();
    await expect(firstCard).toBeVisible();

    const pokemonName = await firstCard.locator("h3").textContent();
    const favoriteButton = firstCard.getByRole("button", { name: /favorite/i });

    await favoriteButton.click();

    // 2. Go to Favorites page
    await page.goto("/favorites");

    // 3. Verify it's there
    await expect(page.getByText(`${pokemonName}`)).toBeVisible();
    await expect(page.getByText("1 Pokémon Saved")).toBeVisible();
  });

  test("should remove a favorite from the favorites page", async ({ page }) => {
    // 1. Setup: Add a favorite via localStorage to be fast
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("favorites-storage", JSON.stringify({
        state: {
          favorites: [1], // Bulbasaur
          version: 1
        }
      }));
    });

    // 2. Go to Favorites page
    await page.goto("/favorites");
    await expect(page.getByText("Bulbasaur", { exact: false })).toBeVisible();

    // 3. Click remove (favorite button again)
    await page.getByRole("button", { name: /favorite/i }).click();

    // 4. Should show empty state immediately
    await expect(page.getByText("No favorites yet")).toBeVisible();
  });

  test("should search within favorites", async ({ page }) => {
    // 1. Setup: Add multiple favorites
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("favorites-storage", JSON.stringify({
        state: {
          favorites: [1, 4, 7], // Bulbasaur, Charmander, Squirtle
          version: 1
        }
      }));
    });

    await page.goto("/favorites");
    await expect(page.getByText("Bulbasaur", { exact: false })).toBeVisible();
    await expect(page.getByText("Charmander", { exact: false })).toBeVisible();
    await expect(page.getByText("Squirtle", { exact: false })).toBeVisible();

    // 2. Search for "char"
    const searchInput = page.getByPlaceholder("Search favorites...");
    await searchInput.fill("char");

    // 3. Verify results
    await expect(page.getByText("Charmander", { exact: false })).toBeVisible();
    await expect(page.getByText("Bulbasaur", { exact: false })).not.toBeVisible();
    await expect(page.getByText("Squirtle", { exact: false })).not.toBeVisible();
  });

  test("should sort favorites", async ({ page }) => {
    // 1. Setup: Add multiple favorites
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("favorites-storage", JSON.stringify({
        state: {
          favorites: [1, 4, 7], // Bulbasaur, Charmander, Squirtle
          version: 1
        }
      }));
    });

    await page.goto("/favorites");

    // Default is number-asc: Bulbasaur (#001), Charmander (#004), Squirtle (#007)
    let cards = page.locator("article h3");
    await expect(cards.nth(0)).toHaveText(/bulbasaur/i);
    await expect(cards.nth(2)).toHaveText(/squirtle/i);

    // 2. Sort by Name A-Z
    await page.getByTitle("Sort by Name (A-Z)").click();
    // Bulbasaur, Charmander, Squirtle (same in this case, let's try Name Z-A)

    await page.getByTitle("Sort by Name (Z-A)").click();
    await expect(cards.nth(0)).toHaveText(/squirtle/i);
    await expect(cards.nth(2)).toHaveText(/bulbasaur/i);

    // 3. Sort by Number Desc
    await page.getByTitle("Sort by Number (Descending)").click();
    await expect(cards.nth(0)).toHaveText(/squirtle/i); // #007
    await expect(cards.nth(2)).toHaveText(/bulbasaur/i); // #001
  });
});
