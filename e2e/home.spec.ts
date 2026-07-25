import { test, expect } from './fixtures';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Quiz PixFan/i);
  });

  test('displays category quiz cards, daily challenge and random mix', async ({ page }) => {
    await expect(page.locator('.quiz-card--daily')).toBeVisible();
    await expect(page.locator('.quiz-card--random')).toBeVisible();
    await expect(
      page.locator('.quiz-card:not(.quiz-card--random):not(.quiz-card--daily)')
    ).toHaveCount(7);
  });

  test('displays quiz titles in French by default', async ({ page }) => {
    const firstCard = page.locator('.quiz-card').first();
    await expect(firstCard.locator('.quiz-card__title')).toBeVisible();
  });

  test('shows question count on each quiz card', async ({ page }) => {
    const quizCards = page.locator('.quiz-card');
    for (let i = 0; i < await quizCards.count(); i++) {
      const chip = quizCards.nth(i).locator('.quiz-card__meta-chip').first();
      await expect(chip).toBeVisible();
    }
  });

  test('navigates to quiz when clicking a quiz card', async ({ page }) => {
    await page
      .locator('.quiz-card:not(.quiz-card--random):not(.quiz-card--daily)')
      .first()
      .click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
  });
});

