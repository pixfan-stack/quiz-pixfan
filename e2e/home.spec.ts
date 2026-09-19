import { test, expect, openMorePacks, CATEGORY_CARD } from './fixtures';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Quiz PixFan/i);
  });

  test('displays category quiz cards, daily challenge, duel and random mix', async ({ page }) => {
    await expect(page.locator('.quiz-card--daily')).toBeVisible();
    await expect(page.locator('.quiz-card--duel')).toBeVisible();
    await expect(page.locator('.quiz-card--photo')).toBeVisible();
    await expect(page.locator('.home-more-packs')).toBeVisible();

    await openMorePacks(page);

    await expect(page.locator('.quiz-card--random')).toBeVisible();
    await expect(page.locator('.difficulty-filter')).toBeVisible();
    await expect(page.locator('.weekly-leaders')).toBeVisible();
    await expect(page.locator('.achievements')).toBeVisible();
    await expect(page.locator(CATEGORY_CARD)).toHaveCount(11);
  });

  test('copies daily link without starting a quiz; duel has no scoreless invite', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('.quiz-card-with-copy .quiz-card-copy-btn').first().click();
    await expect(page.locator('.quiz-card--daily .quiz-card__desc')).toContainText(
      /copié|copied/i
    );
    await expect(page.locator('.question-text')).toHaveCount(0);

    // Wave 2: duel invites carry a score from results only — no home copy button.
    await expect(page.locator('.quiz-card--duel')).toBeVisible();
    await expect(
      page.locator('.quiz-card--duel').locator('xpath=..').locator('.quiz-card-copy-btn')
    ).toHaveCount(0);
  });



  test('displays quiz titles in French by default', async ({ page }) => {
    const firstCard = page.locator('.quiz-card').first();
    await expect(firstCard.locator('.quiz-card__title')).toBeVisible();
  });

  test('shows question count on each quiz card', async ({ page }) => {
    await openMorePacks(page);
    const quizCards = page.locator('.quiz-card');
    for (let i = 0; i < await quizCards.count(); i++) {
      const chip = quizCards.nth(i).locator('.quiz-card__meta-chip').first();
      await expect(chip).toBeVisible();
    }
  });

  test('navigates to quiz when clicking a quiz card', async ({ page }) => {
    await openMorePacks(page);
    await page.locator(CATEGORY_CARD).first().click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
  });
});
