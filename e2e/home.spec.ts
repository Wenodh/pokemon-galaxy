import { test, expect } from "@playwright/test";

test("has title and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Pokemon Galaxy/);
  const pokedexLink = page.getByRole("link", { name: "Pokedex" });
  await expect(pokedexLink).toBeVisible();
});
