import { test, expect } from '@playwright/test';

test.describe('Team Import & Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/team-builder');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Force waiting for the Create New Team empty state to render
    const createBtn = page.getByRole('button', { name: /Create New Team/i }).first();
    await expect(createBtn).toBeVisible({ timeout: 10000 });

    await createBtn.click();
    await page.getByLabel(/Team Name/i).fill('Export Test Team');
    await page.getByRole('button', { name: 'Create Team', exact: true }).click();
    await expect(page.getByText('Export Test Team').first()).toBeVisible();

    // Add at least one Pokémon so the team is not empty and passes import validation
    await page.getByLabel("Add Bulbasaur to active team").click();
    await expect(page.getByText("1 / 6 Pokémon")).toBeVisible();
  });

  test('should open export dialog and show JSON', async ({ page }) => {
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Export Team/i, { exact: true }).click();

    await expect(page.getByText('Export Team', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'JSON' })).toHaveClass(/bg-primary/);

    const textarea = page.locator('role=dialog').locator('textarea');
    const content = await textarea.inputValue();
    expect(content).toContain('"version": 1');
    expect(content).toContain('"name": "Export Test Team"');
  });

  test('should show Showdown format in export dialog', async ({ page }) => {
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Export Team/i, { exact: true }).click();

    await page.getByRole('button', { name: 'Showdown' }).click();

    const textarea = page.locator('role=dialog').locator('textarea');
    const content = await textarea.inputValue();
    expect(content).toContain('=== Export Test Team ===');
  });

  test('should import a team from JSON', async ({ page }) => {
    // 1. Get export data from existing team
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Export Team/i, { exact: true }).click();
    const json = await page.locator('role=dialog').locator('textarea').inputValue();
    await page.locator('role=dialog').getByRole('button', { name: 'Close', exact: true }).first().click();

    // 2. Open import dialog
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Import Team/i, { exact: true }).click();

    // 3. Paste JSON and import
    await page.locator('role=dialog').locator('textarea').fill(json);
    await page.locator('role=dialog').getByRole('button', { name: /Preview Team/i }).click();

    // 4. Confirm Import
    await expect(page.getByText(/Review your team/i)).toBeVisible();
    await page.locator('role=dialog').getByRole('button', { name: /Confirm Import/i }).click();

    // 5. Verify success and new team name
    await expect(page.getByText(/Team imported successfully/i)).toBeVisible();
    await expect(page.getByText('Export Test Team (Imported)').first()).toBeVisible();
  });

  test('should show validation error for invalid JSON', async ({ page }) => {
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Import Team/i, { exact: true }).click();

    await page.locator('role=dialog').locator('textarea').fill('invalid json');
    await page.locator('role=dialog').getByRole('button', { name: /Preview Team/i }).click();

    // It should show both JSON error AND malformed showdown error since it tries both
    await expect(page.getByText(/Import failed/i)).toBeVisible();
  });
});
