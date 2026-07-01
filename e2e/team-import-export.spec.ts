import { test, expect } from '@playwright/test';

test.describe('Team Import & Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/team-builder');

    // Create a team first if none exists to test export
    const createBtn = page.getByRole('button', { name: /Create New Team/i }).first();
    if (await createBtn.isVisible()) {
        await createBtn.click();
        await page.getByLabel(/Team Name/i).fill('Export Test Team');
        await page.locator('button[type="submit"]').click();
        await expect(page.getByText('Export Test Team').first()).toBeVisible();
    }
  });

  test('should open export dialog and show JSON', async ({ page }) => {
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Export Team/i, { exact: true }).click();

    await expect(page.getByText('Export Team', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'JSON' })).toHaveClass(/bg-primary/);

    const textarea = page.locator('textarea');
    const content = await textarea.inputValue();
    expect(content).toContain('"version": 1');
    expect(content).toContain('"name": "Export Test Team"');
  });

  test('should show Showdown format in export dialog', async ({ page }) => {
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Export Team/i, { exact: true }).click();

    await page.getByRole('button', { name: 'Showdown' }).click();

    const textarea = page.locator('textarea');
    const content = await textarea.inputValue();
    expect(content).toContain('=== Export Test Team ===');
  });

  test('should import a team from JSON', async ({ page }) => {
    // 1. Get export data from existing team
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Export Team/i, { exact: true }).click();
    const json = await page.locator('textarea').inputValue();
    await page.getByRole('button', { name: 'Close' }).click();

    // 2. Open import dialog
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Import Team/i, { exact: true }).click();

    // 3. Paste JSON and import
    await page.locator('textarea').fill(json);
    await page.getByRole('button', { name: 'Import Team' }).click();

    // 4. Verify success and new team name
    await expect(page.getByText(/Team imported successfully/i)).toBeVisible();
    await expect(page.getByText('Export Test Team (Imported)').first()).toBeVisible();
  });

  test('should show validation error for invalid JSON', async ({ page }) => {
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByText(/Import Team/i, { exact: true }).click();

    await page.locator('textarea').fill('invalid json');
    await page.getByRole('button', { name: 'Import Team' }).click();

    await expect(page.getByText(/The provided text is not valid JSON/i)).toBeVisible();
  });
});
