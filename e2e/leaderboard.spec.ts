import { test, expect } from '@playwright/test';

test.describe('Leaderboard profile', () => {
  test('shows name modal for first-time visitors', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('quiz-pixfan-player-display-name');
      localStorage.removeItem('quiz-pixfan-name-prompt-seen');
    });

    await page.goto('/');

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('.player-modal__title')).toBeVisible();
  });

  test('chip opens name editor after skip', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('quiz-pixfan-player-display-name');
      localStorage.removeItem('quiz-pixfan-name-prompt-seen');
    });

    await page.goto('/');
    await page.getByRole('button', { name: /Plus tard|Later/i }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.locator('.player-chip').click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('random mix card is visible when quizzes load', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('quiz-pixfan-name-prompt-seen', '1');
    });

    await page.goto('/');

    await expect(page.locator('.quiz-card--random')).toBeVisible({ timeout: 8000 });
  });
});
