import { useTranslation } from 'react-i18next';
import type { Question, Quiz } from '../../types/quiz';
import { pickLocale } from '../../utils/locale';

interface AdminQuestionsPanelProps {
  draft: Quiz[];
  activeQuiz: Quiz | undefined;
  question: Question | undefined;
  questionIndex: number;
  lang: string;
  onQuizIdChange: (quizId: string) => void;
  onQuestionIndexChange: (index: number) => void;
  onUpdateQuestion: (patch: Partial<Question>) => void;
  onUpdateLocalized: (
    field: 'text' | 'explanation',
    locale: 'en' | 'fr',
    value: string
  ) => void;
  onUpdateAnswerText: (
    answerId: string,
    locale: 'en' | 'fr',
    value: string
  ) => void;
}

/**
 * Questions tab: quiz/question picker + bilingual editor.
 */
export function AdminQuestionsPanel({
  draft,
  activeQuiz,
  question,
  questionIndex,
  lang,
  onQuizIdChange,
  onQuestionIndexChange,
  onUpdateQuestion,
  onUpdateLocalized,
  onUpdateAnswerText,
}: AdminQuestionsPanelProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="admin__toolbar">
        <label className="setting-label">
          {t('admin.quiz')}
          <select
            className="setting-select"
            value={activeQuiz?.id ?? ''}
            onChange={(e) => onQuizIdChange(e.target.value)}
          >
            {draft.map((q) => (
              <option key={q.id} value={q.id}>
                {pickLocale(q.title, lang)}
              </option>
            ))}
          </select>
        </label>
        <label className="setting-label">
          {t('admin.question')}
          <select
            className="setting-select"
            value={questionIndex}
            onChange={(e) => onQuestionIndexChange(Number(e.target.value))}
          >
            {(activeQuiz?.questions ?? []).map((q, i) => (
              <option key={q.id} value={i}>
                {i + 1}. {pickLocale(q.text, lang).slice(0, 48)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {question && (
        <div className="admin__editor card">
          <label className="setting-label">
            FR
            <textarea
              className="admin__textarea"
              rows={3}
              value={question.text.fr}
              onChange={(e) => onUpdateLocalized('text', 'fr', e.target.value)}
            />
          </label>
          <label className="setting-label">
            EN
            <textarea
              className="admin__textarea"
              rows={3}
              value={question.text.en}
              onChange={(e) => onUpdateLocalized('text', 'en', e.target.value)}
            />
          </label>

          <p className="admin__section-title">{t('admin.answers')}</p>
          <ul className="admin__answers">
            {question.answers.map((a) => {
              const correct = question.correctAnswers.includes(a.id);
              return (
                <li key={a.id} className="admin__answer">
                  <label className="admin__correct">
                    <input
                      type={question.type === 'single' ? 'radio' : 'checkbox'}
                      name="correct"
                      checked={correct}
                      onChange={() => {
                        if (question.type === 'single') {
                          onUpdateQuestion({ correctAnswers: [a.id] });
                        } else {
                          const set = new Set(question.correctAnswers);
                          if (set.has(a.id)) set.delete(a.id);
                          else set.add(a.id);
                          onUpdateQuestion({ correctAnswers: [...set] });
                        }
                      }}
                    />
                    {t('admin.correct')}
                  </label>
                  <input
                    className="admin__input"
                    value={a.text.fr}
                    onChange={(e) =>
                      onUpdateAnswerText(a.id, 'fr', e.target.value)
                    }
                    aria-label={`FR ${a.id}`}
                  />
                  <input
                    className="admin__input"
                    value={a.text.en}
                    onChange={(e) =>
                      onUpdateAnswerText(a.id, 'en', e.target.value)
                    }
                    aria-label={`EN ${a.id}`}
                  />
                </li>
              );
            })}
          </ul>

          <label className="setting-label">
            {t('admin.explanation')} (FR)
            <textarea
              className="admin__textarea"
              rows={2}
              value={question.explanation?.fr ?? ''}
              onChange={(e) =>
                onUpdateLocalized('explanation', 'fr', e.target.value)
              }
            />
          </label>
          <label className="setting-label">
            {t('admin.explanation')} (EN)
            <textarea
              className="admin__textarea"
              rows={2}
              value={question.explanation?.en ?? ''}
              onChange={(e) =>
                onUpdateLocalized('explanation', 'en', e.target.value)
              }
            />
          </label>
        </div>
      )}
    </>
  );
}
