import { test, expect, openMorePacks } from './fixtures';

test.describe('Leaderboard profile', () => {
  test('does not auto-open name modal on first home visit', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('quiz-pixfan-player-display-name');
      localStorage.removeItem('quiz-pixfan-name-prompt-seen');
      localStorage.removeItem('quiz-pixfan-last-played-at');
      localStorage.removeItem('quiz-pixfan-highscores');
    });

    await page.goto('/');

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('home-hero')).toBeVisible();
    await expect(page.locator('.player-chip:not(.player-chip--sync)')).toBeVisible();
  });

  test('chip opens name editor without prior auto-gate', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('quiz-pixfan-player-display-name');
      localStorage.removeItem('quiz-pixfan-name-prompt-seen');
    });

    await page.goto('/');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.locator('.player-chip:not(.player-chip--sync)').click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('random mix card is visible when quizzes load', async ({ page }) => {
    await page.goto('/');
    await openMorePacks(page);
    await expect(page.locator('.quiz-card--random')).toBeVisible({ timeout: 8000 });
  });
});
