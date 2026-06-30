import { test, expect } from "@playwright/test";

test.describe("Team Builder UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/team-builder");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("should show empty state when no teams exist", async ({ page }) => {
    await expect(page.getByText("No Team Selected")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Team" }).first()).toBeVisible();
  });

  test("should create a new team", async ({ page }) => {
    await page.getByRole("button", { name: "Create Team" }).first().click();
    await page.getByLabel("Team Name").fill("Testing Team");
    await page.getByRole("button", { name: "Create Team", exact: true }).click();

    await expect(page.getByText("Testing Team")).toBeVisible();
    await expect(page.getByText("0 / 6 Pokémon")).toBeVisible();
  });

  test("should add and remove pokemon", async ({ page }) => {
    // Create team
    await page.getByRole("button", { name: "Create Team" }).first().click();
    await page.getByLabel("Team Name").fill("Add Test Team");
    await page.getByRole("button", { name: "Create Team", exact: true }).click();

    // Add Bulbasaur
    await page.getByLabel("Add Bulbasaur to active team").click();
    await expect(page.getByText("Added Bulbasaur to Add Test Team")).toBeVisible();
    await expect(page.getByText("1 / 6 Pokémon")).toBeVisible();

    // Check it's in a slot
    const slot = page.locator("div").filter({ hasText: /^Bulbasaur$/ }).first();
    await expect(slot).toBeVisible();

    // Remove Bulbasaur
    await page.getByLabel("Remove Bulbasaur from team").click();
    await expect(page.getByText("Removed Bulbasaur from team")).toBeVisible();
    await expect(page.getByText("0 / 6 Pokémon")).toBeVisible();
  });

  test("should enforce team limit and duplicate prevention", async ({ page }) => {
    // Create team
    await page.getByRole("button", { name: "Create Team" }).first().click();
    await page.getByLabel("Team Name").fill("Limit Test Team");
    await page.getByRole("button", { name: "Create Team", exact: true }).click();

    // Add Bulbasaur
    await page.getByLabel("Add Bulbasaur to active team").click();

    // Try to add Bulbasaur again
    await page.getByLabel("Add Bulbasaur to active team").click();
    await expect(page.getByText("Bulbasaur already in team")).toBeVisible();

    // Add more to fill (Total 6)
    const pokemon = ["Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard"];
    for (const name of pokemon) {
        await page.getByLabel(`Add ${name} to active team`).click();
    }

    await expect(page.getByText("6 / 6 Pokémon")).toBeVisible();

    // Try to add 7th
    await page.getByLabel("Add Squirtle to active team").click();
    await expect(page.getByText("Team is full")).toBeVisible();
  });
});
