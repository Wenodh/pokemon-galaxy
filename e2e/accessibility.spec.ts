import { test, expect } from "@playwright/test";

test.describe("WCAG 2.2 Accessibility & Inclusive UX Audit Tests", () => {
  test("Skip to Main Content link exists and shifts focus", async ({ page }) => {
    await page.goto("/");

    // Wait for the client application to hydrate and render
    await page.waitForSelector("header", { timeout: 15000 });
    await page.waitForSelector("main#main-content", { timeout: 15000 });

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Focus the skip link directly to verify focusability
    await skipLink.focus();
    const isActive = await page.evaluate(() => document.activeElement === document.querySelector('a[href="#main-content"]'));
    expect(isActive).toBe(true);

    // Press Enter to activate skip link
    await page.keyboard.press("Enter");

    // Active element should now be the main content container
    const activeId = await page.evaluate(() => document.activeElement?.id);
    expect(activeId).toBe("main-content");
  });

  test("Landmarks exist and are semantic", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("header", { timeout: 15000 });
    await page.waitForSelector("main#main-content", { timeout: 15000 });
    await page.waitForSelector("footer", { timeout: 15000 });

    // Check header
    await expect(page.locator("header")).toBeVisible();

    // Check main
    await expect(page.locator("main#main-content")).toBeAttached();

    // Check footer
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Theme toggle buttons are accessible and have labels", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("button[aria-label=\"Light mode\"]", { timeout: 15000 });

    const lightToggle = page.locator('button[aria-label="Light mode"]');
    const darkToggle = page.locator('button[aria-label="Dark mode"]');
    const systemToggle = page.locator('button[aria-label="System mode"]');

    await expect(lightToggle).toBeAttached();
    await expect(darkToggle).toBeAttached();
    await expect(systemToggle).toBeAttached();
  });

  test("Search inputs are properly labeled for screen readers", async ({ page }) => {
    await page.goto("/pokedex");
    await page.waitForSelector('input[aria-label="Search"]', { timeout: 15000 });

    // Search input should have an aria-label="Search" or similar description
    const searchInput = page.locator('input[aria-label="Search"]');
    await expect(searchInput).toBeVisible();
  });
});
