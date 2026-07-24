import { useTranslation } from 'react-i18next';
import type { Quiz } from '../types/quiz';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { QuestionView } from './QuestionView';
import { ResultScreen } from './ResultScreen';

interface QuizScreenProps {
  quiz: Quiz;
  onHome: () => void;
  /** Enable timed mode (seconds per question). 0 = disabled. */
  timePerQuestion?: number;
  /** Enable anti-cheat (tab switch detection). */
  antiCheat?: boolean;
}

/**
 * Orchestrates one quiz session: questions → results.
 * Supports optional timer mode and anti-cheat.
 */
export default function QuizScreen({
  quiz,
  onHome,
  timePerQuestion = 0,
  antiCheat = false,
}: QuizScreenProps) {
  const { t } = useTranslation();
  const engine = useQuizEngine(quiz, { timePerQuestion, antiCheat });

  if (engine.phase === 'finished' && engine.result) {
    return (
      <ResultScreen
        quiz={quiz}
        result={engine.result}
        onRetry={engine.reset}
        onHome={onHome}
      />
    );
  }

  if (!engine.currentQuestion) {
    return <p>{t('common.error')}</p>;
  }

  return (
    <QuestionView
      question={engine.currentQuestion}
      questionNumber={engine.progress.current}
      totalQuestions={engine.progress.total}
      selectedIds={engine.selectedIds}
      phase={engine.phase === 'feedback' ? 'feedback' : 'answering'}
      lastWasCorrect={engine.lastWasCorrect}
      currentStreak={engine.currentStreak}
      isLast={engine.isLast}
      onToggle={engine.toggleAnswer}
      onSubmit={engine.submitAnswer}
      onNext={engine.goNext}
      timerRemaining={engine.timerRemaining}
      timerIsCritical={engine.timerIsCritical}
      timerEnabled={engine.timerEnabled}
      tabSwitches={engine.tabSwitches}
      antiCheatEnabled={engine.antiCheatEnabled}
    />
  );
}
