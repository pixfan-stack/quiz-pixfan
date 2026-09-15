import { test as base, expect, type Page } from '@playwright/test';

/**
 * Default fixture: skip the first-visit name modal so existing flows can click through.
 * Tests that need the modal should clear those keys in addInitScript (runs after this).
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.setItem('quiz-pixfan-name-prompt-seen', '1');
    });
    await use(page);
  },
});

/** Wave 4: secondary packs (mix, categories, difficulty) live in a collapsed `<details>`. */
export async function openMorePacks(page: Page): Promise<void> {
  const details = page.locator('.home-more-packs');
  await expect(details).toBeVisible({ timeout: 8000 });
  const isOpen = await details.evaluate(
    (el) => (el as HTMLDetailsElement).open
  );
  if (!isOpen) {
    await details.locator('summary').click();
  }
  await expect(page.locator('.home-more-packs__body')).toBeVisible();
}

export const CATEGORY_CARD =
  '.quiz-card:not(.quiz-card--random):not(.quiz-card--daily):not(.quiz-card--duel):not(.quiz-card--weak):not(.quiz-card--photo)';

export { expect };
