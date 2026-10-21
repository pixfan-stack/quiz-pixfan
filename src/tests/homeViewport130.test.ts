import { describe, expect, it } from 'vitest';
import appSource from '../App.tsx?raw';
import heroSource from '../components/quiz-selector/HomeHero.tsx?raw';
import shareSource from '../components/result/ResultShareSection.tsx?raw';
import morePacksSource from '../components/quiz-selector/MorePacksSection.tsx?raw';
import themeJs from '../../public/guides/theme.js?raw';
import hub from '../../public/guides/scolaires/index.html?raw';
import globalCss from '../styles/global.css?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('home / result quiet chrome (vague 1.30)', () => {
  it('Daily share keeps one primary CTA; exports live under share-more', () => {
    const dailyPrimary = shareSource.indexOf('data-testid="share-daily-primary"');
    const dailyMore = shareSource.indexOf('data-testid="share-daily-more"');
    const shareMore = shareSource.indexOf('className="share-more"');
    expect(dailyPrimary).toBeGreaterThan(-1);
    expect(dailyMore).toBeGreaterThan(dailyPrimary);
    expect(shareMore).toBeGreaterThan(dailyPrimary);
    expect(dailyMore).toBeGreaterThan(shareMore);
    // Daily arm of share-primary only (ends before duel branch)
    const dailyArmStart = shareSource.indexOf('{isDaily ? (');
    const duelArm = shareSource.indexOf(') : isDuel ? (', dailyArmStart);
    expect(duelArm).toBeGreaterThan(dailyArmStart);
    const dailyArm = shareSource.slice(dailyArmStart, duelArm);
    expect(dailyArm.match(/btn--primary/g)?.length ?? 0).toBe(1);
    expect(dailyArm).toContain('share-daily-primary');
    expect(dailyArm).not.toContain("onExportImage('square')");
    expect(dailyArm).not.toContain("onExportImage('story')");
    expect(dailyArm).not.toContain('onChallengeFriend');
    const moreRegion = shareSource.slice(dailyMore, dailyMore + 1200);
    expect(moreRegion).toContain("onExportImage('square')");
    expect(moreRegion).toContain("onExportImage('story')");
    expect(moreRegion).toContain('onChallengeFriend');
  });

  it('WeakSpotsDueChip is not an install-prompt pink twin', () => {
    if (globalCss.length > 0) {
      const chip = globalCss.match(
        /\.weak-spots-due-chip\s*\{[^}]+\}/
      )?.[0];
      expect(chip).toBeTruthy();
      expect(chip).toContain('background: transparent');
      expect(chip).toContain('border-bottom');
      expect(chip).not.toMatch(/pixfan-pink|color-primary\)\s*8%/);
    }
  });

  it('hub h1 is shortened (no programme / curriculum in H1)', () => {
    expect(hub).toContain('<h1>Scolaires — photo en classe</h1>');
    expect(hub).toContain('<h1>Schools — photo in class</h1>');
    expect(hub).not.toContain('<h1>Scolaires — photo &amp; programme officiel</h1>');
    expect(hub).not.toContain(
      '<h1>Schools — photo &amp; French national curriculum</h1>'
    );
    expect(hub).toContain('data-hub-hero-cta');
  });

  it('dark toggle uses short text, not emoji-only (SPA + guides)', () => {
    expect(appSource).toContain('common.darkModeShort');
    expect(appSource).toContain('common.lightModeShort');
    expect(appSource).toContain('aria-pressed={isDark}');
    expect(appSource).not.toContain("'🌙'");
    expect(appSource).not.toContain("'☀️'");
    expect(themeJs).toContain('shortLabel');
    expect(themeJs).toContain("'Nuit'");
    expect(themeJs).toContain("'Dark'");
    expect(themeJs).not.toContain("'🌙'");
    expect(fr.common.darkModeShort).toBe('Nuit');
    expect(en.common.darkModeShort).toBe('Dark');
  });

  it('hero hint is short and distinct from recognition desc', () => {
    expect(heroSource).toContain('home.photoReadingHint');
    expect(heroSource).not.toContain("t('home.photoReadingDesc')");
    expect(fr.home.photoReadingHint).toMatch(/10 photos/i);
    expect(en.home.photoReadingHint).toMatch(/10 photos/i);
    expect(fr.home.photoReadingHint).not.toMatch(/Pour toi si/i);
    expect(en.home.photoReadingHint).not.toMatch(/Choose this if/i);
    expect(fr.home.photoReadingDesc).toMatch(/Pour toi si/i);
  });

  it('weak/random modes use recognition copy + neutral mark', () => {
    expect(fr.home.weakSpotsDesc).toMatch(/Pour toi si/i);
    expect(fr.home.randomQuizDesc).toMatch(/Pour toi si/i);
    expect(en.home.weakSpotsDesc).toMatch(/Choose this if/i);
    expect(en.home.randomQuizDesc).toMatch(/Choose this if/i);
    expect(morePacksSource).not.toContain('🎯');
    expect(morePacksSource).not.toContain('🎲');
  });
});
