import { describe, expect, it } from 'vitest';
import sw from '../../public/sw.js?raw';
import achievementsPanel from '../components/AchievementsPanel.tsx?raw';

describe('P2 a11y / PWA hygiene', () => {
  it('bumps SW cache to v13 and precaches guides shell', () => {
    expect(sw).toContain("CACHE_NAME = 'quiz-pixfan-v13'");
    expect(sw).not.toContain("CACHE_NAME = 'quiz-pixfan-v12'");
    expect(sw).toContain("'/guides/'");
    expect(sw).toContain("'/guides/index.html'");
    expect(sw).toContain("'/guides/guides.css'");
    expect(sw).toContain("'/guides/theme.js'");
  });

  it('keeps guide navigations out of the SPA index.html offline fallback path', () => {
    expect(sw).toContain('isGuidePath');
    expect(sw).toContain('matchGuideOffline');
    expect(sw).toMatch(/guideNav[\s\S]*cache\.put\(event\.request/);
    expect(sw).toMatch(/matchGuideOffline\(event\.request,\s*url\)/);
  });

  it('names compact AchievementsPanel without a missing labelledby id', () => {
    expect(achievementsPanel).toContain(
      "aria-labelledby={compact ? undefined : 'achievements-title'}"
    );
    expect(achievementsPanel).toContain(
      "aria-label={compact ? t('achievements.title') : undefined}"
    );
  });
});
