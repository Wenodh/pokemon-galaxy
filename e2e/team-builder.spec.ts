import { test, expect } from "@playwright/test";

test.describe("Team Builder UI", () => {
  test.beforeEach(async ({ page }) => {
    // Start with a clean state if possible, or just navigate to the page
    await page.goto("/team-builder");
  });

  test("should show empty state when no teams exist", async ({ page }) => {
    // Depending on previous tests, we might need to clear storage
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.getByText("No Teams Yet")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Your First Team" })).toBeVisible();
  });

  test("should create a new team", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.getByRole("button", { name: "Create Your First Team" }).click();
    await page.getByLabel("Team Name").fill("Testing Team");
    await page.getByRole("button", { name: "Create Team" }).click();

    await expect(page.getByText("Testing Team")).toBeVisible();
    await expect(page.getByText("0 / 6 Pokémon")).toBeVisible();
    await expect(page.getByText("Active")).toBeVisible();
  });

  test("should rename a team", async ({ page }) => {
    // Ensure we have a team to rename
    await page.evaluate(() => {
      localStorage.clear();
      // Mock storage if needed or just use the UI to create one
    });
    await page.reload();
    await page.getByRole("button", { name: "Create Your First Team" }).click();
    await page.getByLabel("Team Name").fill("Initial Name");
    await page.getByRole("button", { name: "Create Team" }).click();

    // Open Rename Dialog
    await page.getByLabel("Actions for Initial Name").click();
    await page.getByRole("menuitem", { name: "Rename" }).click();

    await page.getByLabel("Team Name").fill("Renamed Team");
    await page.getByRole("button", { name: "Save Changes" }).click();

    await expect(page.getByText("Renamed Team")).toBeVisible();
    await expect(page.getByText("Initial Name")).not.toBeVisible();
  });

  test("should duplicate a team", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole("button", { name: "Create Your First Team" }).click();
    await page.getByLabel("Team Name").fill("Original Team");
    await page.getByRole("button", { name: "Create Team" }).click();

    await page.getByLabel("Actions for Original Team").click();
    await page.getByRole("menuitem", { name: "Duplicate" }).click();

    await expect(page.getByText("Original Team Copy")).toBeVisible();
  });

  test("should delete a team", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole("button", { name: "Create Your First Team" }).click();
    await page.getByLabel("Team Name").fill("To Delete");
    await page.getByRole("button", { name: "Create Team" }).click();

    await page.getByLabel("Actions for To Delete").click();
    await page.getByRole("menuitem", { name: "Delete" }).click();

    await page.getByRole("button", { name: "Delete Team" }).click();

    await expect(page.getByText("To Delete")).not.toBeVisible();
    await expect(page.getByText("No Teams Yet")).toBeVisible();
  });

  test("should switch active team", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Create Team 1
    await page.getByRole("button", { name: "Create Your First Team" }).click();
    await page.getByLabel("Team Name").fill("Team 1");
    await page.getByRole("button", { name: "Create Team" }).click();

    // Create Team 2
    await page.getByRole("button", { name: "New Team" }).click();
    await page.getByLabel("Team Name").fill("Team 2");
    await page.getByRole("button", { name: "Create Team" }).click();

    // Click Team 1 card to set active
    await page.getByText("Team 1").click();

    const team1Card = page.locator("div").filter({ hasText: /^Team 1$/ }).locator("..");
    // The active indicator is inside the card
    await expect(page.locator("div").filter({ hasText: /^Team 1$/ }).locator("..").locator("..").getByText("Active")).toBeVisible();

    // Click Team 2 card to set active
    await page.getByText("Team 2").click();
    await expect(page.locator("div").filter({ hasText: /^Team 2$/ }).locator("..").locator("..").getByText("Active")).toBeVisible();
  });
});
