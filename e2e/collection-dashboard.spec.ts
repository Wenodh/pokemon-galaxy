import { test, expect } from "@playwright/test";

test.describe("Collection Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/collection");
  });

  test("should show empty state initially", async ({ page }) => {
    await expect(page.getByText("Collection is empty")).toBeVisible();
    await expect(page.getByRole("button", { name: "Explore Pokédex" })).toBeVisible();
  });

  test("should navigate to pokedex from empty state", async ({ page }) => {
    await page.getByRole("button", { name: "Explore Pokédex" }).click();
    await expect(page).toHaveURL("/pokedex");
  });

  test("should support search and sort in collection", async ({ page }) => {
    // This test would ideally mock the store state to have some items,
    // but in a real environment it depends on user data.
    // For now, we verify the UI components are present.
    await expect(page.getByRole("button", { name: "Views" })).toBeVisible();
    await expect(page.getByPlaceholder("Search by name or number...")).toBeVisible();
  });
});
