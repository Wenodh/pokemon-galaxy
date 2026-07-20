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
    await page.getByRole('button', { name: /Create New Team/i }).first().click();
    await page.getByLabel('Team Name').fill('Elite Four');
    await page.getByRole('button', { name: 'Create Team', exact: true }).click();

    await expect(page.getByText('Elite Four').first()).toBeVisible();
    await expect(page.getByText('0 / 6 Pokémon')).toBeVisible();

    // 2. Add Pokémon from Explorer
    // Add Bulbasaur
    const firstAddBtn = page.getByLabel("Add bulbasaur to active team");
    await firstAddBtn.click();
    await expect(page.getByText('Added Bulbasaur to Elite Four.')).toBeVisible();
    await expect(page.getByText('1 / 6 Pokémon')).toBeVisible();

    // Add Ivysaur
    const secondAddBtn = page.getByLabel("Add ivysaur to active team");
    await secondAddBtn.click();
    await expect(page.getByText('Added Ivysaur to Elite Four.')).toBeVisible();

    // 3. Duplicate Prevention
    await expect(page.getByLabel("bulbasaur already in team")).toBeDisabled();

    // 4. Remove Pokémon
    await page.getByRole('button', { name: /remove bulbasaur/i }).click();
    await expect(page.getByText('Removed bulbasaur from team.')).toBeVisible();
    await expect(page.getByText('1 / 6 Pokémon')).toBeVisible();

    // 5. Navigation & Multiple Teams
    await page.goto('/pokedex');

    // Create second team
    await page.goto('/team-builder');
    // Since "Elite Four" is active, we click the team selector dropdown first
    await page.getByRole('button', { name: 'Elite Four' }).click();
    await page.getByRole('menuitem', { name: /create new team/i }).click();
    await page.getByLabel('Team Name').fill('Legendaries');
    await page.getByRole('button', { name: 'Create Team', exact: true }).click();

    await page.goto('/pokedex');
    // Open menu on first card (Bulbasaur)
    const card = page.locator('article').first();
    await card.hover();
    await card.getByRole('button', { name: /options for/i }).click();
    await page.getByRole('menuitem', { name: /add to team/i }).click();

    // Should see dialog with both teams
    await expect(page.getByRole('heading', { name: /add Bulbasaur to team/i })).toBeVisible();
    await expect(page.getByText('Elite Four').first()).toBeVisible();
    await expect(page.getByText('Legendaries').first()).toBeVisible();

    // Add to Legendaries
    await page.getByRole('button', { name: /legendaries/i }).click();
    await expect(page.getByText('Added Bulbasaur to Legendaries.')).toBeVisible();

    // 6. Persistence
    await page.reload();
    await page.goto('/team-builder');
    await expect(page.getByText('Legendaries').first()).toBeVisible();
    await expect(page.getByText('1 / 6 Pokémon')).toBeVisible();
  });
});
