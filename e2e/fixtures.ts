import { test as base, expect } from '@playwright/test';

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

export { expect };
