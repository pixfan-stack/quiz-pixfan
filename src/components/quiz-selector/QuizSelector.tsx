import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pickLocale } from '../../utils/locale';
import { Leaderboard } from '../Leaderboard';
import { WeeklyLeaders } from '../WeeklyLeaders';
import { DailyNudge } from '../DailyNudge';
import { SeasonBanner } from '../SeasonBanner';
import { AchievementsPanel } from '../AchievementsPanel';
import { WeakSpotsDueChip } from '../WeakSpotsDueChip';
import { RANDOM_QUIZ_ID } from '../../utils/randomQuiz';
import type { QuizSelectorProps } from './types';
import { useQuizSelectorState } from './useQuizSelectorState';
import { QuizSettingsBar } from './QuizSettingsBar';
import { HomeHero } from './HomeHero';
import { FeaturedQuizCards } from './FeaturedQuizCards';
import { HomePhotoCloser } from './HomePhotoCloser';
import { MorePacksSection } from './MorePacksSection';
import { hasCompletedAnyQuiz } from '../../utils/reengage';

export function QuizSelector({
  quizzes,
  onSelect,
  onSettingsChange,
  onPrefetchQuiz,
  leaderboardRefreshToken = 0,
  recoveryCode = null,
  onRecovered,
  classeMode = false,
}: QuizSelectorProps) {
  const state = useQuizSelectorState({
    quizzes,
    onSelect,
    onSettingsChange,
    onPrefetchQuiz,
    leaderboardRefreshToken,
    recoveryCode,
    onRecovered,
  });
  const { t } = useTranslation();
  const [leaderboardHasEntries, setLeaderboardHasEntries] = useState(false);
  const postPlay = hasCompletedAnyQuiz();
  // Hero owns the photo-reading Start on the Persuade home; keep the
  // featured photo card only in classe mode (no daily/duel peers).
  const showPhotoFeatured = classeMode;

  return (
    <section className="home">
      <HomeHero
        photoTeaserUrl={state.photoTeaser?.imageUrl}
        photoPackAvailable={state.photoPackAvailable}
        onStartPhotoReading={state.handleStartPhotoReading}
        onPrefetchQuiz={onPrefetchQuiz}
      />

      <QuizSettingsBar
        recoveryCode={state.recoveryCode}
        onRecovered={state.onRecovered}
        showSettings={state.showSettings}
        setShowSettings={state.setShowSettings}
        timePerQuestion={state.timePerQuestion}
        setTimePerQuestion={state.setTimePerQuestion}
        antiCheat={state.antiCheat}
        setAntiCheat={state.setAntiCheat}
        reminderOn={state.reminderOn}
        onToggleReminder={state.handleToggleReminder}
        langCode={state.langCode}
        classeMode={classeMode}
      />

      {!classeMode && <DailyNudge onPlayDaily={state.handleStartDaily} />}
      <WeakSpotsDueChip onReview={state.handleStartWeakSpots} />
      {!classeMode && <SeasonBanner />}

      {quizzes.length > 0 && (
        <FeaturedQuizCards
          photoPackAvailable={state.photoPackAvailable}
          photoTeaser={state.photoTeaser}
          photoPoolCount={state.photoPoolCount}
          dailyTeaser={state.dailyTeaser}
          duelTeaser={state.duelTeaser}
          dailyThemeChip={state.dailyThemeChip}
          dailyThemeDesc={state.dailyThemeDesc}
          dailyGuideUrl={state.dailyGuideUrl}
          dailyPlayed={state.dailyPlayed}
          dailyLinkCopied={state.dailyLinkCopied}
          dailyCountdown={state.dailyCountdown}
          dailyStreak={state.dailyStreak}
          streakFreezes={state.streakFreezes}
          dailyId={state.dailyId}
          getBestScore={state.getBestScore}
          onPrefetchQuiz={onPrefetchQuiz}
          onStartPhotoReading={state.handleStartPhotoReading}
          onStartDaily={state.handleStartDaily}
          onStartDuel={state.handleStartDuel}
          onCopyDailyLink={state.handleCopyDailyLink}
          showCompetitive={!classeMode}
          showPhotoFeatured={showPhotoFeatured}
        />
      )}

      <div className="scolaires-home-chip" data-testid="scolaires-home-chip">
        <a
          className="scolaires-home-chip__btn"
          href="/guides/scolaires/"
          data-testid="scolaires-home-chip-link"
        >
          <span className="scolaires-home-chip__label">
            {t('scolaires.chip')}
          </span>
          <span className="scolaires-home-chip__hint">
            {t('scolaires.chipHint')}
          </span>
        </a>
      </div>

      {!classeMode && postPlay && state.difficultyFilter === 'all' && (
        <WeeklyLeaders
          quizzes={quizzes}
          refreshToken={leaderboardRefreshToken}
          onSeeAll={state.scrollToLeaderboard}
        />
      )}

      <MorePacksSection
        morePacksOpen={state.morePacksOpen}
        setMorePacksOpen={state.setMorePacksOpen}
        difficultyFilter={state.difficultyFilter}
        setDifficultyFilter={state.setDifficultyFilter}
        visibleQuizzes={state.visibleQuizzes}
        quizzes={quizzes}
        playCounts={state.playCounts}
        vaultCount={state.vaultCount}
        dueCount={state.dueCount}
        lang={state.lang}
        getBestScore={state.getBestScore}
        onPrefetchQuiz={onPrefetchQuiz}
        onStartQuiz={state.handleStartQuiz}
        onStartRandom={state.handleStartRandom}
        onStartWeakSpots={state.handleStartWeakSpots}
        onStartDifficultyMix={state.handleStartDifficultyMix}
      />

      {!classeMode && !postPlay && (
        <HomePhotoCloser
          photoPackAvailable={state.photoPackAvailable}
          dailyPlayed={state.dailyPlayed}
          dailyCountdown={state.dailyCountdown}
          onStartPhotoReading={state.handleStartPhotoReading}
          onStartDaily={state.handleStartDaily}
          onPrefetchQuiz={onPrefetchQuiz}
        />
      )}

      {!classeMode && postPlay && <AchievementsPanel />}

      {!classeMode && postPlay && (
        <div
          className={`leaderboard-section${
            leaderboardHasEntries ? '' : ' leaderboard-section--quiet'
          }`}
          ref={state.leaderboardSectionRef}
          id="leaderboard"
        >
          {leaderboardHasEntries && (
            <select
              className="setting-select"
              value={state.leaderboardQuizId ?? ''}
              onChange={(e) =>
                state.setLeaderboardQuizId(e.target.value || undefined)
              }
              aria-label={t('leaderboard.title')}
            >
              <option value="">{t('leaderboard.filterAll')}</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {pickLocale(quiz.title, state.lang)}
                </option>
              ))}
              <option value={RANDOM_QUIZ_ID}>{t('home.randomQuiz')}</option>
            </select>
          )}
          <Leaderboard
            quizId={state.leaderboardQuizId}
            limit={20}
            quizzes={quizzes}
            refreshToken={leaderboardRefreshToken}
            defaultPeriod="week"
            quietEmpty
            onHasEntriesChange={setLeaderboardHasEntries}
          />
        </div>
      )}
    </section>
  );
}
