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
    await expect(page.locator('.difficulty-filter').first()).toBeVisible();
    await expect(page.locator('.difficulty-filter-more')).toBeVisible();
    await expect(page.locator('.achievements')).toBeVisible();
    await expect(page.getByTestId('achievements-teaser')).toBeVisible();
    await expect(page.locator(CATEGORY_CARD)).toHaveCount(15);
  });

  test('shows brand-first hero with photo CTA', async ({ page }) => {
    await expect(page.getByTestId('home-hero')).toBeVisible();
    await expect(page.getByTestId('home-hero-cta')).toBeVisible();
    await expect(page.locator('.home-hero__brand')).toContainText(/Quiz PixFan|PixFan/i);
  });

  test('quiets empty home leaderboard into a teaser', async ({ page }) => {
    await page.route('**/api/leaderboard**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ leaderboard: [] }),
      });
    });
    await page.goto('/');
    await expect(page.getByTestId('leaderboard-quiet-loading')).toHaveCount(0, {
      timeout: 10000,
    });
    const teaser = page.getByTestId('leaderboard-empty-teaser');
    await expect(teaser).toBeVisible({ timeout: 8000 });
    await expect(teaser.locator('summary')).toContainText(
      /Classement|Leaderboard/i
    );
    await expect(page.locator('.leaderboard-section .setting-select')).toHaveCount(
      0
    );
    await expect(page.getByTestId('season-badges')).toHaveCount(0);
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

  test('home chip links to real /guides/scolaires/ hub', async ({ page }) => {
    await expect(page.getByTestId('scolaires-home-chip')).toBeVisible({
      timeout: 8000,
    });
    const link = page.getByTestId('scolaires-home-chip-link');
    await expect(link).toHaveAttribute('href', '/guides/scolaires/');
    await link.click();
    await expect(
      page.locator('article.fr h1, article.en h1').first()
    ).toContainText(/Scolaires|Schools/i, { timeout: 8000 });
    expect(page.url()).toMatch(/\/guides\/scolaires\/?/);
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

  test('opens a shared duel deep link with score challenge', async ({ page }) => {
    await page.goto('/#/quiz/duel-abcd2345?score=70');
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.page-title, .quiz-header, h1, h2').first()).toBeVisible();
  });

  test('hides season banner before any play', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('quiz-pixfan-last-season-seen');
      localStorage.removeItem('quiz-pixfan-season-ending-dismissed');
      localStorage.removeItem('quiz-pixfan-last-played-at');
      localStorage.removeItem('quiz-pixfan-highscores');
    });
    await page.goto('/');
    await expect(page.getByTestId('season-banner')).toHaveCount(0);
  });

  test('shows season start banner after first play', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('quiz-pixfan-last-played-at', new Date().toISOString());
      localStorage.removeItem('quiz-pixfan-last-season-seen');
      localStorage.removeItem('quiz-pixfan-season-ending-dismissed');
    });
    await page.goto('/');
    await expect(page.getByTestId('season-banner')).toBeVisible({ timeout: 8000 });
  });
});
