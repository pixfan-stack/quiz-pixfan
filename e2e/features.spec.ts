import { test, expect } from './fixtures';

test.describe('Language Switching', () => {
  test('switches to English', async ({ page }) => {
    await page.goto('/');
    
    // Click language switcher
    const langBtn = page.locator('.lang-switcher__btn').first();
    await langBtn.click();
    
    // Check English text appears
    const welcomeText = page.locator('.page-title');
    await expect(welcomeText).toContainText('Choose a quiz', { timeout: 5000 });
  });

  test('switches back to French', async ({ page }) => {
    await page.goto('/');
    
    // Switch to English first
    await page.locator('.lang-switcher__btn').first().click();
    await expect(page.locator('.page-title')).toContainText('Choose a quiz');
    
    // Switch back to French
    await page.locator('.lang-switcher__btn').nth(1).click();
    
    // Check French text
    await expect(page.locator('.page-title')).toContainText('Choisissez un quiz');
  });

  test('quiz questions display in selected language', async ({ page }) => {
    await page.goto('/');
    
    // Switch to English
    await page.locator('.lang-switcher__btn').first().click();
    
    // Start quiz
    await page
      .locator('.quiz-card:not(.quiz-card--random):not(.quiz-card--daily)')
      .first()
      .click();
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
    await page
      .locator('.quiz-card:not(.quiz-card--random):not(.quiz-card--daily)')
      .first()
      .click();
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
    await page
      .locator('.quiz-card:not(.quiz-card--random):not(.quiz-card--daily)')
      .first()
      .click();
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
    
    // Toggle anti-cheat
    await page.locator('.toggle-btn').click();
    
    // Check toggle is on
    await expect(page.locator('.toggle-btn--on')).toBeVisible();
  });
});
