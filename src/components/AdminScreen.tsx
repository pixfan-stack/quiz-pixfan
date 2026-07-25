import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Question, Quiz, QuizzesData } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import {
  isAdminEnabled,
  isAdminUnlocked,
  lockAdmin,
  unlockAdmin,
} from '../utils/adminAuth';

interface AdminScreenProps {
  quizzes: Quiz[];
  onHome: () => void;
  /** Apply a session preview of edited data into the live quiz list. */
  onPreview: (quizzes: Quiz[]) => void;
}

/**
 * Minimal question editor: edit copy, preview in-session, export JSON for deploy.
 */
export default function AdminScreen({
  quizzes,
  onHome,
  onPreview,
}: AdminScreenProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const [unlocked, setUnlocked] = useState(isAdminUnlocked());
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const cloneQuizzes = (list: Quiz[]) =>
    JSON.parse(JSON.stringify(list)) as Quiz[];

  const [draft, setDraft] = useState<Quiz[]>(() => cloneQuizzes(quizzes));
  const [quizId, setQuizId] = useState(quizzes[0]?.id ?? '');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    setDraft(cloneQuizzes(quizzes));
    if (quizzes[0] && !quizzes.some((q) => q.id === quizId)) {
      setQuizId(quizzes[0].id);
      setQuestionIndex(0);
    }
  }, [quizzes, quizId]);

  const activeQuiz = useMemo(
    () => draft.find((q) => q.id === quizId) ?? draft[0],
    [draft, quizId]
  );
  const question: Question | undefined = activeQuiz?.questions[questionIndex];

  if (!isAdminEnabled()) {
    return (
      <section className="admin">
        <h2>{t('admin.title')}</h2>
        <p>{t('admin.disabled')}</p>
        <button type="button" className="btn btn--secondary" onClick={onHome}>
          {t('result.backHome')}
        </button>
      </section>
    );
  }

  if (!unlocked) {
    return (
      <section className="admin">
        <h2>{t('admin.title')}</h2>
        <p className="admin__hint">{t('admin.pinHint')}</p>
        <form
          className="admin__pin-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (unlockAdmin(pin)) {
              setUnlocked(true);
              setError('');
            } else {
              setError(t('admin.pinError'));
            }
          }}
        >
          <label className="setting-label" htmlFor="admin-pin">
            {t('admin.pin')}
          </label>
          <input
            id="admin-pin"
            type="password"
            className="setting-select admin__pin-input"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="admin__error">{error}</p>}
          <div className="btn-row">
            <button type="submit" className="btn btn--primary">
              {t('admin.unlock')}
            </button>
            <button type="button" className="btn btn--secondary" onClick={onHome}>
              {t('result.backHome')}
            </button>
          </div>
        </form>
      </section>
    );
  }

  const updateQuestion = (patch: Partial<Question>) => {
    if (!activeQuiz || !question) return;
    setDraft((prev) =>
      prev.map((quiz) => {
        if (quiz.id !== activeQuiz.id) return quiz;
        const questions = quiz.questions.map((q, i) =>
          i === questionIndex ? { ...q, ...patch } : q
        );
        return { ...quiz, questions };
      })
    );
  };

  const updateLocalized = (
    field: 'text' | 'explanation',
    locale: 'en' | 'fr',
    value: string
  ) => {
    if (!question) return;
    const current = question[field] ?? { en: '', fr: '' };
    updateQuestion({
      [field]: { ...current, [locale]: value },
    });
  };

  const updateAnswerText = (answerId: string, locale: 'en' | 'fr', value: string) => {
    if (!question) return;
    updateQuestion({
      answers: question.answers.map((a) =>
        a.id === answerId
          ? { ...a, text: { ...a.text, [locale]: value } }
          : a
      ),
    });
  };

  const exportJson = () => {
    const payload: QuizzesData = { quizzes: draft };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions.json';
    a.click();
    URL.revokeObjectURL(url);
    setSavedMsg(t('admin.exported'));
    window.setTimeout(() => setSavedMsg(''), 2500);
  };

  const applyPreview = () => {
    onPreview(cloneQuizzes(draft));
    setSavedMsg(t('admin.previewApplied'));
    window.setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <section className="admin">
      <header className="admin__header">
        <h2>{t('admin.title')}</h2>
        <p className="admin__hint">{t('admin.intro')}</p>
      </header>

      <div className="admin__toolbar">
        <label className="setting-label">
          {t('admin.quiz')}
          <select
            className="setting-select"
            value={activeQuiz?.id ?? ''}
            onChange={(e) => {
              setQuizId(e.target.value);
              setQuestionIndex(0);
            }}
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
            onChange={(e) => setQuestionIndex(Number(e.target.value))}
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
              onChange={(e) => updateLocalized('text', 'fr', e.target.value)}
            />
          </label>
          <label className="setting-label">
            EN
            <textarea
              className="admin__textarea"
              rows={3}
              value={question.text.en}
              onChange={(e) => updateLocalized('text', 'en', e.target.value)}
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
                          updateQuestion({ correctAnswers: [a.id] });
                        } else {
                          const set = new Set(question.correctAnswers);
                          if (set.has(a.id)) set.delete(a.id);
                          else set.add(a.id);
                          updateQuestion({ correctAnswers: [...set] });
                        }
                      }}
                    />
                    {t('admin.correct')}
                  </label>
                  <input
                    className="admin__input"
                    value={a.text.fr}
                    onChange={(e) => updateAnswerText(a.id, 'fr', e.target.value)}
                    aria-label={`FR ${a.id}`}
                  />
                  <input
                    className="admin__input"
                    value={a.text.en}
                    onChange={(e) => updateAnswerText(a.id, 'en', e.target.value)}
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
              onChange={(e) => updateLocalized('explanation', 'fr', e.target.value)}
            />
          </label>
          <label className="setting-label">
            {t('admin.explanation')} (EN)
            <textarea
              className="admin__textarea"
              rows={2}
              value={question.explanation?.en ?? ''}
              onChange={(e) => updateLocalized('explanation', 'en', e.target.value)}
            />
          </label>
        </div>
      )}

      {savedMsg && (
        <p className="admin__status" role="status">
          {savedMsg}
        </p>
      )}

      <div className="btn-row admin__actions">
        <button type="button" className="btn btn--primary" onClick={exportJson}>
          {t('admin.export')}
        </button>
        <button type="button" className="btn btn--ghost" onClick={applyPreview}>
          {t('admin.preview')}
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            lockAdmin();
            setUnlocked(false);
            onHome();
          }}
        >
          {t('admin.lock')}
        </button>
      </div>
    </section>
  );
}
