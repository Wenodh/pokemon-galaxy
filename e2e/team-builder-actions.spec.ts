import { test, expect } from '@playwright/test';

test.describe('Team Builder Actions', () => {
  test.beforeEach(async ({ page }) => {
    // Clear local storage to start fresh
    await page.goto('/team-builder');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('full team building workflow', async ({ page }) => {
    // 1. Create a team
    await page.getByRole('button', { name: /create team/i }).first().click();
    await page.getByPlaceholder(/enter team name/i).fill('Elite Four');
    await page.getByRole('button', { name: /create team/i }).nth(1).click();

    await expect(page.getByText('Elite Four')).toBeVisible();
    await expect(page.getByText('0 / 6 Pokémon')).toBeVisible();

    // 2. Add Pokémon from Explorer
    // Add Bulbasaur
    const firstAddBtn = page.getByRole('button', { name: /^add$/i }).first();
    await firstAddBtn.click();
    await expect(page.getByText('Added Bulbasaur to Elite Four.')).toBeVisible();
    await expect(page.getByText('1 / 6 Pokémon')).toBeVisible();

    // Add Ivysaur
    const secondAddBtn = page.getByRole('button', { name: /^add$/i }).nth(1);
    await secondAddBtn.click();
    await expect(page.getByText('Added Ivysaur to Elite Four.')).toBeVisible();

    // 3. Duplicate Prevention
    await firstAddBtn.click();
    await expect(page.getByText(/already in team/i)).toBeVisible();

    // 4. Remove Pokémon
    await page.getByRole('button', { name: /remove bulbasaur/i }).click();
    await expect(page.getByText('Removed Bulbasaur from team.')).toBeVisible();
    await expect(page.getByText('1 / 6 Pokémon')).toBeVisible();

    // 5. Navigation & Multiple Teams
    await page.goto('/pokedex');

    // Create second team
    await page.goto('/team-builder');
    await page.getByRole('button', { name: /create new team/i }).click();
    await page.getByPlaceholder(/enter team name/i).fill('Legendaries');
    await page.getByRole('button', { name: /create team/i }).nth(1).click();

    await page.goto('/pokedex');
    // Open menu on first card (Bulbasaur)
    const card = page.locator('article').first();
    await card.hover();
    await card.getByRole('button', { name: /options for/i }).click();
    await page.getByRole('menuitem', { name: /add to team/i }).click();

    // Should see dialog with both teams
    await expect(page.getByRole('heading', { name: /add Bulbasaur to team/i })).toBeVisible();
    await expect(page.getByText('Elite Four')).toBeVisible();
    await expect(page.getByText('Legendaries')).toBeVisible();

    // Add to Legendaries
    await page.getByRole('button', { name: /legendaries/i }).click();
    await expect(page.getByText('Added Bulbasaur to Legendaries.')).toBeVisible();

    // 6. Persistence
    await page.reload();
    await page.goto('/team-builder');
    // Ensure Legendaries is active (it was the last one added to/created)
    // Actually, setActive might need to be verified.
    await expect(page.getByText('Legendaries')).toBeVisible();
    await expect(page.getByText('1 / 6 Pokémon')).toBeVisible();
  });
});
