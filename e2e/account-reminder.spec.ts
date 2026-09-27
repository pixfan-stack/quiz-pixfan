import { test, expect, openMorePacks } from './fixtures';

/**
 * P1.3 — account redeem summary + daily reminder toggle + vault due chip.
 */

test.describe('Daily reminder toggle', () => {
  test('enables reminder from settings when Notification is granted', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      class MockNotification {
        static permission: NotificationPermission = 'default';
        static requestPermission = async () => {
          MockNotification.permission = 'granted';
          return 'granted' as NotificationPermission;
        };
        constructor(
          public title: string,
          public options?: NotificationOptions
        ) {}
      }
      Object.defineProperty(window, 'Notification', {
        configurable: true,
        writable: true,
        value: MockNotification,
      });
    });

    await page.goto('/');
    await page
      .locator('button:has-text("⚙️ Paramètres"), button:has-text("⚙️ Settings")')
      .click();

    const toggle = page.locator('#daily-reminder-toggle');
    await expect(toggle).toBeVisible({ timeout: 5000 });
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await toggle.click();
    await expect(toggle).toHaveClass(/toggle-btn--on/);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});

test.describe('Account redeem summary', () => {
  test('shows vault / badges / streak text after mocked redeem', async ({
    page,
  }) => {
    await page.route('**/api/account', async (route) => {
      const body = route.request().postDataJSON() as { action?: string };
      if (body?.action === 'redeem') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            progress: {
              playerId: 'player-e2e-redeem',
              displayName: 'E2E',
              streak: {
                currentStreak: 5,
                bestStreak: 9,
                lastDailyId: 'daily-2026-09-26',
                freezesAvailable: 1,
                freezeWeekKey: null,
              },
              achievements: ['first-quiz', 'daily-3'],
              highscores: [],
              vault: [
                {
                  questionId: 'exposure-basics__q1',
                  sourceQuizId: 'exposure-basics',
                  missCount: 2,
                  lastMissedAt: '2026-09-20T00:00:00.000Z',
                },
                {
                  questionId: 'composition__q2',
                  sourceQuizId: 'composition',
                  missCount: 1,
                  lastMissedAt: '2026-09-21T00:00:00.000Z',
                },
              ],
              seasonBadges: {
                '2026-08': 'participant',
                '2026-09': 'streak-season',
              },
            },
          }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/');
    await page
      .locator('button:has-text("⚙️ Paramètres"), button:has-text("⚙️ Settings")')
      .click();

    const input = page.locator('.account-sync__input');
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill('ABCD-EFGH-JKMN');
    await page.locator('.account-sync button.btn--primary').click();

    const summary = page.getByTestId('redeem-summary');
    await expect(summary).toBeVisible({ timeout: 5000 });
    // vault:2 · badges:2 · streak:5 · achievements:2
    await expect(summary).toContainText(/2/);
    await expect(summary).toContainText(/5/);
    await expect(summary).toContainText(
      /Weak spots|Points faibles|Season badges|Badges|Streak|Série|Achievements|Succès/i
    );
  });
});

test.describe('Weak-spots vault chip', () => {
  test('shows due chip when vault has enough due mistakes', async ({ page }) => {
    await page.addInitScript(() => {
      const old = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(
        'quiz-pixfan-mistake-vault',
        JSON.stringify([
          {
            questionId: 'exposure-basics__q1',
            sourceQuizId: 'exposure-basics',
            missCount: 3,
            lastMissedAt: old,
          },
          {
            questionId: 'composition__q2',
            sourceQuizId: 'composition',
            missCount: 3,
            lastMissedAt: old,
          },
          {
            questionId: 'light-color__q3',
            sourceQuizId: 'light-color',
            missCount: 2,
            lastMissedAt: old,
          },
        ])
      );
    });

    await page.goto('/');
    await expect(page.getByTestId('weak-spots-due-chip')).toBeVisible({
      timeout: 8000,
    });

    await openMorePacks(page);
    await expect(page.locator('.quiz-card--weak')).toBeVisible();
  });
});
