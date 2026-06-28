import { test, expect } from "@playwright/test";

test.describe("Collection UI Integration", () => {
  test("updates collection status from Details page and reflects on Card", async ({ page }) => {
    // 1. Start on Pokedex page
    await page.goto("/pokedex");

    // 2. Click on Bulbasaur
    await page.click('text="Bulbasaur"');
    await expect(page).toHaveURL(/\/pokemon\/bulbasaur/);

    // 3. Verify Collection section exists
    await expect(page.locator('text="Collection"').first).toBeVisible();

    // 4. Mark as Caught and Shiny
    const caughtBtn = page.getByRole('button', { name: 'Caught' });
    const shinyBtn = page.getByRole('button', { name: 'Shiny' });

    await caughtBtn.click();
    await shinyBtn.click();

    await expect(caughtBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(shinyBtn).toHaveAttribute('aria-pressed', 'true');

    // 5. Go back to Pokedex and check badges on card
    await page.goto("/pokedex");

    const card = page.locator('article', { hasText: 'Bulbasaur' });
    // We use aria-hidden="true" on icons but parent div has title or sr-only text
    await expect(card.getByTitle('Caught')).toBeVisible();
    await expect(card.getByTitle('Shiny')).toBeVisible();

    // 6. Reload and verify persistence
    await page.reload();
    await expect(card.getByTitle('Caught')).toBeVisible();
    await expect(card.getByTitle('Shiny')).toBeVisible();
  });
});
