import { describe, expect, it } from 'vitest';
import leaderboardSource from '../components/Leaderboard.tsx?raw';
import achievementsSource from '../components/AchievementsPanel.tsx?raw';
import quizSelectorSource from '../components/quiz-selector/QuizSelector.tsx?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('home social quieter (critique P2 leftovers)', () => {
  it('Leaderboard supports quietEmpty teaser + has-entries callback', () => {
    expect(leaderboardSource).toContain('quietEmpty');
    expect(leaderboardSource).toContain('leaderboard-empty-teaser');
    expect(leaderboardSource).toContain('leaderboard-quiet-loading');
    expect(leaderboardSource).toContain('onHasEntriesChange');
    expect(leaderboardSource).toContain('emptyTeaser');
  });

  it('home QuizSelector uses quietEmpty post-play and hides filter until rows exist', () => {
    expect(quizSelectorSource).toContain('quietEmpty');
    expect(quizSelectorSource).toContain('leaderboardHasEntries');
    expect(quizSelectorSource).toContain('leaderboard-section--quiet');
    expect(quizSelectorSource).toContain('postPlay && (');
    expect(quizSelectorSource).toContain('HomePhotoCloser');
  });

  it('AchievementsPanel hides empty season badges and collapses 0/12 chrome', () => {
    expect(achievementsSource).toContain('seasonBadges.length > 0');
    expect(achievementsSource).toContain('collapseLockedWall');
    expect(achievementsSource).not.toContain('season.badgesEmpty');
  });

  it('exposes FR/EN empty leaderboard copy', () => {
    expect(fr.leaderboard.emptyTeaser).toMatch(/Classement/i);
    expect(fr.leaderboard.emptyInvite).toMatch(/calme/i);
    expect(en.leaderboard.emptyTeaser).toMatch(/Leaderboard/i);
    expect(en.leaderboard.emptyInvite).toMatch(/quiet/i);
  });
});
