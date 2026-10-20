import { test, expect, openMorePacks, CATEGORY_CARD } from './fixtures';

test.describe('Language Switching', () => {
  test('switches to English', async ({ page }) => {
    await page.goto('/');

    // Click EN in the language switcher
    await page.getByRole('button', { name: 'EN', exact: true }).click();

    // Brand-first hero lead is locale-specific (`.page-title` retired from home)
    await expect(page.locator('.home-hero__lead')).toContainText('Photos to analyze', {
      timeout: 5000,
    });
  });

  test('switches back to French', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.locator('.home-hero__lead')).toContainText('Photos to analyze');

    await page.getByRole('button', { name: 'FR', exact: true }).click();

    await expect(page.locator('.home-hero__lead')).toContainText('Photos à analyser');
  });

  test('quiz questions display in selected language', async ({ page }) => {
    await page.goto('/');
    
    // Switch to English
    await page.locator('.lang-switcher__btn').first().click();
    
    // Start quiz
    await openMorePacks(page);
    await page.locator(CATEGORY_CARD).first().click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
    
    // Should see English text in question
    const questionText = await page.locator('.question-text').textContent();
    expect(questionText).not.toContain('Quel'); // French word
  });
});

test.describe('Dark Mode', () => {
  test('toggles dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Click dark mode toggle
    const darkModeBtn = page.locator('.dark-mode-toggle');
    await darkModeBtn.click();
    
    // Check dark mode class is applied
    await expect(page.locator('html')).toHaveClass(/dark-mode/);
  });

  test('dark mode persists during navigation', async ({ page }) => {
    await page.goto('/');
    
    // Enable dark mode
    await page.locator('.dark-mode-toggle').click();
    
    // Start a quiz
    await openMorePacks(page);
    await page.locator(CATEGORY_CARD).first().click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
    
    // Check dark mode is still active
    await expect(page.locator('html')).toHaveClass(/dark-mode/);
  });
});

test.describe('Timer Mode', () => {
  test('enables timer mode from settings', async ({ page }) => {
    await page.goto('/');
    
    // Open settings
    await page.locator('button:has-text("⚙️ Paramètres"), button:has-text("⚙️ Settings")').click();
    
    // Select timer duration
    await page.locator('#timer-select').selectOption('30');
    
    // Start quiz
    await openMorePacks(page);
    await page.locator(CATEGORY_CARD).first().click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
    
    // Timer should be visible (check for stat-pill containing "s")
    const timerPill = page.locator('.stat-pill').filter({ hasText: /[0-9]+s/ });
    await expect(timerPill).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Anti-Cheat Mode', () => {
  test('enables anti-cheat from settings', async ({ page }) => {
    await page.goto('/');
    
    // Open settings
    await page.locator('button:has-text("⚙️ Paramètres"), button:has-text("⚙️ Settings")').click();
    
    // Toggle anti-cheat (settings may also expose the daily-reminder switch)
    await page.locator('#anticheat-toggle').click();

    // Check toggle is on
    await expect(page.locator('#anticheat-toggle.toggle-btn--on')).toBeVisible();
  });
});
