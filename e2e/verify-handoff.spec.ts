import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', name: 'home' },
  { path: '/pokedex', name: 'pokedex' },
  { path: '/team-builder', name: 'team-builder' },
  { path: '/battle', name: 'battle' },
  { path: '/quiz', name: 'quiz' },
  { path: '/settings', name: 'settings' },
];

test.describe('Route Verification', () => {
  for (const route of routes) {
    test(`Verify route: ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('domcontentloaded');

      // Check if not 404 unless it's the intended behavior
      const title = await page.title();
      expect(title).not.toBe('404: This page could not be found');

      await page.screenshot({ path: `verification/routes/${route.name}.png`, fullPage: true });
    });
  }
});

test.describe('Feature Verification', () => {
  test('Search by Name and ID', async ({ page }) => {
    await page.goto('/pokedex');
    await page.waitForSelector('input[placeholder*="Search"]');
    const searchInput = page.getByPlaceholder(/search/i);

    // Search by name
    await searchInput.fill('pikachu');

    // Wait for the results to update. We look for a card containing "Pikachu"
    // Increased timeout for potentially slow API
    await expect(page.locator('article', { hasText: 'Pikachu' }).first()).toBeVisible({ timeout: 20000 });
    await page.screenshot({ path: 'verification/search-name.png' });

    // Search by ID
    await searchInput.clear();
    await searchInput.fill('25');
    await page.waitForTimeout(1500);
    await expect(page.getByText('Pikachu', { exact: false }).first()).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'verification/search-id.png' });
  });

  test('Infinite Scroll', async ({ page }) => {
    await page.goto('/pokedex');
    await page.waitForLoadState('domcontentloaded');

    // Wait for initial content
    await page.waitForSelector('article');
    const initialCards = await page.locator('article').count();
    expect(initialCards).toBeGreaterThan(0);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for the next page to load (either response or more articles)
    await Promise.race([
      page.waitForResponse(resp => resp.url().includes('graphql'), { timeout: 10000 }).catch(() => {}),
      page.waitForFunction((count) => document.querySelectorAll('article').length > count, initialCards, { timeout: 10000 }).catch(() => {})
    ]);

    const finalCards = await page.locator('article').count();

    expect(finalCards).toBeGreaterThan(initialCards);
    await page.screenshot({ path: 'verification/infinite-scroll.png' });
  });
});

test.describe('Responsive Verification', () => {
  const viewports = [360, 390, 768, 1024, 1440];

  for (const width of viewports) {
    test(`Responsive check: ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/pokedex');
      await page.waitForLoadState('domcontentloaded');

      // Check for horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow).toBe(false);

      await page.screenshot({ path: `verification/responsive/${width}px.png`, fullPage: false });
    });
  }
});
