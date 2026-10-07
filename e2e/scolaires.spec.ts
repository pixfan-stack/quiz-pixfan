import { test, expect, openMorePacks, CATEGORY_CARD } from './fixtures';

/** Answer every question until the results screen appears. */
async function completeCurrentQuiz(
  page: import('@playwright/test').Page,
  maxQuestions = 15
): Promise<void> {
  for (let i = 0; i < maxQuestions; i++) {
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 8000 });
    await page.locator('.answer-option').first().click();
    await page
      .locator('button:has-text("Vérifier"), button:has-text("Check answer")')
      .first()
      .click();
    await expect(page.locator('.feedback')).toBeVisible({ timeout: 3000 });

    const finishBtn = page
      .locator(
        'button:has-text("Voir les résultats"), button:has-text("See results")'
      )
      .first();
    if (await finishBtn.isVisible().catch(() => false)) {
      await finishBtn.click({ force: true });
      break;
    }

    await page
      .locator(
        'button:has-text("Question suivante"), button:has-text("Next question")'
      )
      .first()
      .click({ force: true });
  }
  await expect(page.locator('.result-section')).toBeVisible({ timeout: 8000 });
}

test.describe('Scolaires URL + chrome', () => {
  test('app header and footer Scolaires use real /guides/scolaires/ URL', async ({
    page,
  }) => {
    await page.goto('/');
    const header = page.getByTestId('header-scolaires-link');
    const footer = page.getByTestId('footer-scolaires-link');
    await expect(header).toBeVisible({ timeout: 8000 });
    await expect(footer).toBeVisible();
    await expect(header).toHaveAttribute('href', '/guides/scolaires/');
    await expect(footer).toHaveAttribute('href', '/guides/scolaires/');
  });

  test('static hub /guides/scolaires/ is crawlable and linked from guides index', async ({
    page,
  }) => {
    await page.goto('/guides/');
    await expect(page.locator('h1').first()).toContainText(/Guides/i, {
      timeout: 8000,
    });
    await expect(
      page.locator('a.guide-nav-link[href="/guides/scolaires/"]')
    ).toBeVisible();
    await expect(
      page.locator('a.app-footer__link[href="/guides/scolaires/"]')
    ).toBeVisible();
    await page.goto('/guides/scolaires/');
    await expect(
      page.locator('article.fr h1, article.en h1').first()
    ).toContainText(/Scolaires|Schools/i);
    expect(page.url()).toMatch(/\/guides\/scolaires\/?/);
  });

  test('guide pages expose Scolaires in chrome (triangle + genres)', async ({
    page,
  }) => {
    // Explicit .html for Vite; CF Pages also serves extensionless pretty URLs.
    for (const path of [
      '/guides/triangle-exposition.html',
      '/guides/genres-photo.html',
    ]) {
      await page.goto(path);
      await expect(page.locator('article.fr h1, article.en h1').first()).toBeVisible({
        timeout: 8000,
      });
      await expect(
        page.locator('a.guide-nav-link[href="/guides/scolaires/"]')
      ).toBeVisible();
      await expect(
        page.locator('a.app-footer__link[href="/guides/scolaires/"]')
      ).toBeVisible();
    }
  });
});

test.describe('Scolaires P2 / mode classe', () => {
  test('hub #/scolaires lists c4 first then lycée and starts portrait-light', async ({
    page,
  }) => {
    await page.goto('/#/scolaires');
    await expect(page.getByTestId('scolaires-screen')).toBeVisible({
      timeout: 8000,
    });
    const cards = page.locator('.scolaires__card');
    await expect(cards.first()).toHaveAttribute(
      'data-testid',
      'scolaires-card-c4-regard'
    );
    await expect(
      page.getByTestId('scolaires-start-lycee-pratique')
    ).toBeVisible();
    await page.getByTestId('scolaires-start-lycee-pratique').click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 8000 });
    expect(page.url()).toMatch(/#\/quiz\/portrait-light/);
  });

  test('lexique-image-fixe card is visible in more packs', async ({ page }) => {
    await page.goto('/');
    await openMorePacks(page);
    const lexique = page
      .locator(CATEGORY_CARD)
      .filter({ hasText: /Lexique image fixe|Still-image lexicon/i });
    await expect(lexique).toBeVisible({ timeout: 8000 });
  });

  test('?classe=1 shows banner and hides player-name prompt', async ({
    page,
  }) => {
    await page.goto('/?classe=1');
    await expect(page.locator('.classe-mode-banner').first()).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('.player-chip')).toHaveCount(0);
    await expect(page.locator('.player-modal')).toHaveCount(0);
  });

  test('classe mode result hides share/export, weak-spots CTA and highscore', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    // Clear name-prompt flag so a non-classe session would show the prompt;
    // classe mode must still hide it.
    await page.addInitScript(() => {
      localStorage.removeItem('quiz-pixfan-name-prompt-seen');
    });
    await page.goto('/#/quiz/lexique-image-fixe?classe=1');
    await expect(page.locator('.classe-mode-banner').first()).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 8000 });
    await completeCurrentQuiz(page, 15);

    await expect(page.locator('.classe-mode-banner').first()).toBeVisible();
    await expect(page.locator('.share-section')).toHaveCount(0);
    await expect(page.locator('.result-weak-spots-cta')).toHaveCount(0);
    await expect(page.locator('.highscore-banner')).toHaveCount(0);
    await expect(page.locator('.mistakes-review')).toBeVisible();
  });
});
