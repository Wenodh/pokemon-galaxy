import { test, expect } from '@playwright/test';

test.describe('Team Analysis Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to team builder and create a team
    await page.goto('/team-builder');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Force waiting for the Create New Team empty state to render
    const createBtn = page.getByRole('button', { name: /Create New Team/i }).first();
    await expect(createBtn).toBeVisible({ timeout: 10000 });

    await createBtn.click();
    await page.getByLabel('Team Name').fill('Test Team');
    await page.getByRole('button', { name: 'Create Team', exact: true }).click();
    await expect(page.getByText('Test Team').first()).toBeVisible();

    // Add at least one Pokémon so the team has analysis data
    await page.getByLabel("Add bulbasaur to active team").click();
    await expect(page.getByText("1 / 6 Pokémon")).toBeVisible();
  });

  test('should switch between Builder and Analysis tabs', async ({ page }) => {
    // Ensure we are on the builder tab by default
    await expect(page.getByRole('tab', { name: /Builder/i })).toHaveAttribute('aria-selected', 'true');

    // Switch to analysis tab
    await page.getByRole('tab', { name: /Analysis/i }).click();

    // Verify URL parameter
    await expect(page).toHaveURL(/tab=analysis/);

    // Verify analysis content
    await expect(page.getByText(/Overall Team Rating/i)).toBeVisible();
  });

  test('should display analysis when Pokémon are added', async ({ page }) => {
    // 1. Switch to Analysis
    await page.getByRole('tab', { name: /Analysis/i }).click();

    // 2. Verify Analysis cards are visible
    await expect(page.getByText(/Overall Team Rating/i)).toBeVisible();
    await expect(page.getByText('Preliminary', { exact: true })).toBeVisible(); // Should be preliminary with 1 pokemon
    await expect(page.getByText(/Type Coverage Dashboard/i)).toBeVisible();
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
