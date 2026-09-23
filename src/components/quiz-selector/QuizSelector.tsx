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
import { FeaturedQuizCards } from './FeaturedQuizCards';
import { MorePacksSection } from './MorePacksSection';

export function QuizSelector({
  quizzes,
  onSelect,
  onSettingsChange,
  onPrefetchQuiz,
  leaderboardRefreshToken = 0,
  recoveryCode = null,
  onRecovered,
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

  return (
    <section className="home">
      <header className="home-hero">
        <p className="home-hero__eyebrow">
          <span className="home-hero__eyebrow-dot" aria-hidden="true" />
          {t('app.title')}
        </p>
        <h2 className="page-title">{t('home.welcome')}</h2>
        <p className="page-subtitle">{t('home.selectQuiz')}</p>
      </header>

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
      />

      <DailyNudge onPlayDaily={state.handleStartDaily} />
      <WeakSpotsDueChip onReview={state.handleStartWeakSpots} />
      <SeasonBanner />

      {state.difficultyFilter === 'all' && (
        <WeeklyLeaders
          quizzes={quizzes}
          refreshToken={leaderboardRefreshToken}
          onSeeAll={state.scrollToLeaderboard}
        />
      )}

      {quizzes.length > 0 && (
        <FeaturedQuizCards
          photoPackAvailable={state.photoPackAvailable}
          photoTeaser={state.photoTeaser}
          photoPoolCount={state.photoPoolCount}
          dailyTeaser={state.dailyTeaser}
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

      <AchievementsPanel />

      <div
        className="leaderboard-section"
        ref={state.leaderboardSectionRef}
        id="leaderboard"
      >
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
        <Leaderboard
          quizId={state.leaderboardQuizId}
          limit={20}
          quizzes={quizzes}
          refreshToken={leaderboardRefreshToken}
          defaultPeriod="week"
        />
      </div>
    </section>
  );
}
