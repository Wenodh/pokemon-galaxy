import { test, expect } from "@playwright/test";

test.describe("Discovery Flow (Phase 1A)", () => {
  test("landing page displays featured pokemon", async ({ page }) => {
    await page.goto("/");

    // Check for hero
    await expect(page.getByRole("heading", { name: /Discover Every/i })).toBeVisible();

    // Check for featured section
    await expect(page.getByText("Featured Pokémon")).toBeVisible();

    // Wait for at least one card to appear
    const cards = page.locator("a[href^='/pokemon/']");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test("pokedex infinite scroll and search works", async ({ page }) => {
    await page.goto("/pokedex");

    // Check for search input
    const searchInput = page.getByPlaceholder(/Search by name or number/i);
    await expect(searchInput).toBeVisible();

    // Verify initial load
    const initialCards = page.locator("a[href^='/pokemon/']");
    await expect(initialCards).toHaveCount(20, { timeout: 10000 });

    // Test Search
    await searchInput.fill("bulbasaur");
    await expect(page).toHaveURL(/search=bulbasaur/);

    // Should now show only bulbasaur (or matching ones)
    await expect(page.getByText("bulbasaur", { exact: false }).first()).toBeVisible();
  });
});
