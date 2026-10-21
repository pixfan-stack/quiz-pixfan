import { describe, expect, it } from 'vitest';
import appSource from '../App.tsx?raw';
import seasonBannerSource from '../components/SeasonBanner.tsx?raw';
import dailyNudgeSource from '../components/DailyNudge.tsx?raw';
import installSource from '../components/InstallPrompt.tsx?raw';
import achievementsSource from '../components/AchievementsPanel.tsx?raw';
import resultScreenSource from '../components/result/ResultScreen.tsx?raw';
import softAskSource from '../components/ResultNameSoftAsk.tsx?raw';
import hub from '../../public/guides/scolaires/index.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import themeJs from '../../public/guides/theme.js?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('home / result quiet chrome (vague 1.28)', () => {
  it('SeasonBanner uses own surface, not install-prompt twin', () => {
    expect(seasonBannerSource).toContain('className="season-banner"');
    expect(seasonBannerSource).toContain('season-banner__body');
    expect(seasonBannerSource).toContain('season-banner__actions');
    expect(seasonBannerSource).not.toContain('install-prompt');
    expect(dailyNudgeSource).not.toContain('install-prompt');
    expect(installSource).toContain('className="install-prompt"');
  });

  it('dark toggle exposes aria-pressed (SPA + guides theme.js)', () => {
    expect(appSource).toContain('aria-pressed={isDark}');
    expect(themeJs).toContain("setAttribute('aria-pressed'");
  });

  it('Achievements soft-locks remaining 🔒 behind disclosure after unlocks', () => {
    expect(achievementsSource).toContain('softLockedWall');
    expect(achievementsSource).toContain('data-testid="achievements-locked"');
    expect(achievementsSource).toContain('achievements.lockedSummary');
    expect(fr.achievements.lockedSummary).toMatch(/débloquer/i);
    expect(en.achievements.lockedSummary).toMatch(/locked/i);
  });

  it('soft-ask sits after pack continue and uses secondary Save', () => {
    const continueIdx = resultScreenSource.indexOf(
      'data-testid="result-continue-composition"'
    );
    const softAskIdx = resultScreenSource.indexOf('<ResultNameSoftAsk');
    const ctaIdx = resultScreenSource.indexOf('<PixfanCta');
    expect(continueIdx).toBeGreaterThan(-1);
    expect(softAskIdx).toBeGreaterThan(continueIdx);
    expect(softAskIdx).toBeLessThan(ctaIdx);
    expect(softAskSource).toContain('btn--secondary');
    expect(softAskSource).not.toContain('btn--primary');
  });

  it('hub promotes recommended Lancer before jump details', () => {
    const heroFr = hub.indexOf('data-hub-hero-cta');
    const hubMore = hub.indexOf('class="hub-more"');
    const regard = hub.indexOf('id="c4-regard"');
    expect(heroFr).toBeGreaterThan(-1);
    expect(hubMore).toBeGreaterThan(heroFr);
    expect(regard).toBeGreaterThan(hubMore);
    expect(hub).toContain('Lancer la séance (recommandé)');
    expect(hub).toContain('Start the lesson (recommended)');
    expect(hub).toContain('Pas d’affiliation au ministère');
  });

  it('guide topic footers collapse to Guides + Scolaires', () => {
    const footerNav = composition.match(
      /app-footer__guides[\s\S]*?<\/nav>/
    )?.[0];
    expect(footerNav).toBeTruthy();
    expect(footerNav).toContain('Guides');
    expect(footerNav).toContain('Scolaires');
    expect(footerNav).not.toContain('triangle-exposition');
    expect(footerNav).not.toContain('Exposition');
  });
});
