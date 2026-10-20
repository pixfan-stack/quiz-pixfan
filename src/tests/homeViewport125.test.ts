import { describe, expect, it } from 'vitest';
import installSource from '../components/InstallPrompt.tsx?raw';
import playerSource from '../components/PlayerNameInput.tsx?raw';
import featuredSource from '../components/quiz-selector/FeaturedQuizCards.tsx?raw';
import selectorSource from '../components/quiz-selector/QuizSelector.tsx?raw';
import closerSource from '../components/quiz-selector/HomePhotoCloser.tsx?raw';
import heroSource from '../components/quiz-selector/HomeHero.tsx?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('home viewport quieter (vague 1.25 P1–P2)', () => {
  it('defers InstallPrompt until hasCompletedAnyQuiz', () => {
    expect(installSource).toContain('hasCompletedAnyQuiz');
    expect(installSource).toContain('if (!postPlay) return null');
    expect(installSource).toContain('data-testid="install-prompt"');
  });

  it('hides player chip bar until post-play / name / recovery', () => {
    expect(playerSource).toContain('hasCompletedAnyQuiz');
    expect(playerSource).toContain('showChipBar');
    expect(playerSource).toContain('data-testid="player-chip-bar"');
  });

  it('dedupes flagship: hero owns photo; Daily/Duel secondary CTAs', () => {
    expect(selectorSource).toContain('showPhotoFeatured');
    expect(selectorSource).toContain('showPhotoFeatured = classeMode');
    expect(featuredSource).toContain('showPhotoFeatured');
    expect(featuredSource).toContain('quiz-card__cta--secondary');
    expect(featuredSource).toContain('quiz-card--secondary');
    expect(featuredSource).not.toMatch(/showEmpty\s*\n/);
    expect(featuredSource).not.toContain('showEmpty');
  });

  it('uses plain photo badge copy (not Signature mode)', () => {
    expect(fr.home.photoReadingBadge).toMatch(/illustr/i);
    expect(en.home.photoReadingBadge).toMatch(/illustr/i);
    expect(fr.home.photoReadingBadge).not.toMatch(/signature/i);
    expect(en.home.photoReadingBadge).not.toMatch(/signature/i);
  });

  it('shows photo-forward closer before play; social after', () => {
    expect(selectorSource).toContain('HomePhotoCloser');
    expect(selectorSource).toContain('!postPlay &&');
    expect(selectorSource).toContain('postPlay && <AchievementsPanel');
    expect(closerSource).toContain('hasCompletedAnyQuiz');
    expect(closerSource).toContain('data-testid="home-photo-closer"');
    expect(fr.home.photoCloserTitle).toBeTruthy();
    expect(en.home.photoCloserTitle).toBeTruthy();
  });

  it('keeps hero shade + CTA classes for AA shade polish', () => {
    expect(heroSource).toContain('home-hero__media-shade');
    expect(heroSource).toContain('home-hero__cta-btn');
    expect(heroSource).toContain('home-hero__brand');
    expect(heroSource).toContain('home-hero__lead');
  });
});
