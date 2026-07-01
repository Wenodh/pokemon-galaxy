import { test, expect } from '@playwright/test';

test.describe('Team Analysis Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to team builder and create a team
    await page.goto('/team-builder');

    // Create a team if none exists
    const createBtn = page.getByRole('button', { name: /Create Team/i }).first();
    if (await createBtn.isVisible()) {
        await createBtn.click();
        await page.getByLabel(/Team Name/i).fill('Test Team');
        await page.getByRole('button', { name: /Create/i }).click();
    }
  });

  test('should switch between Builder and Analysis tabs', async ({ page }) => {
    // Ensure we are on the builder tab by default
    await expect(page.getByRole('tab', { name: /Builder/i })).toHaveAttribute('aria-selected', 'true');

    // Switch to analysis tab
    await page.getByRole('tab', { name: /Analysis/i }).click();

    // Verify URL parameter
    await expect(page).toHaveURL(/tab=analysis/);

    // Verify analysis content (empty state initially)
    await expect(page.getByText(/No Analysis Available/i)).toBeVisible();
    await expect(page.getByText(/Add Pokémon to your team/i)).toBeVisible();
  });

  test('should display analysis when Pokémon are added', async ({ page }) => {
    // 1. Add a Pokémon from the explorer
    await page.getByRole('tab', { name: /Builder/i }).click();

    // Wait for explorer to load
    await expect(page.getByText(/Pokémon Explorer/i)).toBeVisible();

    // Find the first "Add" button on a card and click it
    // Note: The Card might have multiple buttons, we want the one that adds to team
    const addButtons = page.locator('button:has-text("Add")');
    await addButtons.first().click();

    // 2. Switch to Analysis
    await page.getByRole('tab', { name: /Analysis/i }).click();

    // 3. Verify Analysis cards are visible
    await expect(page.getByText(/Overall Team Rating/i)).toBeVisible();
    await expect(page.getByText(/Preliminary/i)).toBeVisible(); // Should be preliminary with 1 pokemon
    await expect(page.getByText(/Type Coverage Dashboard/i)).toBeVisible();
    await expect(page.getByText(/Average Team Stats/i)).toBeVisible();
  });

  test('should handle responsive layout', async ({ page }) => {
    await page.getByRole('tab', { name: /Analysis/i }).click();

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if sections are visible
    await expect(page.getByText(/Overall Team Rating/i)).toBeVisible();

    // Desktop view
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByText(/Overall Team Rating/i)).toBeVisible();
  });
});
