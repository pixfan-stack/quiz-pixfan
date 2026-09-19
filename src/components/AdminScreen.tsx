import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Question, Quiz, QuizzesData } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import {
  getAdminSessionPin,
  isAdminEnabled,
  isAdminUnlocked,
  lockAdmin,
  unlockAdmin,
} from '../utils/adminAuth';
import {
  fetchAdminReports,
  moderateAdminReport,
  type AdminReportRow,
} from '../utils/adminReportsApi';

interface AdminScreenProps {
  quizzes: Quiz[];
  onHome: () => void;
  /** Apply a session preview of edited data into the live quiz list. */
  onPreview: (quizzes: Quiz[]) => void;
}

type AdminTab = 'questions' | 'reports';

/**
 * Admin: question editor + name-report moderation (PIN-gated).
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
  const [tab, setTab] = useState<AdminTab>('questions');
  const cloneQuizzes = (list: Quiz[]) =>
    JSON.parse(JSON.stringify(list)) as Quiz[];

  const [draft, setDraft] = useState<Quiz[]>(() => cloneQuizzes(quizzes));
  const [quizId, setQuizId] = useState(quizzes[0]?.id ?? '');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [savedMsg, setSavedMsg] = useState('');

  const [reports, setReports] = useState<AdminReportRow[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState('');
  const [reportBusyId, setReportBusyId] = useState<string | null>(null);

  useEffect(() => {
    setDraft(cloneQuizzes(quizzes));
    if (quizzes[0] && !quizzes.some((q) => q.id === quizId)) {
      setQuizId(quizzes[0].id);
      setQuestionIndex(0);
    }
  }, [quizzes, quizId]);

  const loadReports = useCallback(async () => {
    if (!getAdminSessionPin()) {
      setReportsError(t('admin.reportsUnauthorized'));
      return;
    }
    setReportsLoading(true);
    setReportsError('');
    const result = await fetchAdminReports();
    setReportsLoading(false);
    if (!result.ok) {
      setReports([]);
      setReportsError(
        result.error === 'unauthorized'
          ? t('admin.reportsUnauthorized')
          : t('admin.reportsUnavailable')
      );
      return;
    }
    setReports(result.reports);
  }, [t]);

  useEffect(() => {
    if (unlocked && tab === 'reports') {
      void loadReports();
    }
  }, [unlocked, tab, loadReports]);

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

  const handleModerate = async (
    action: 'mask' | 'dismiss',
    playerId: string
  ) => {
    setReportBusyId(playerId);
    const result = await moderateAdminReport(action, playerId);
    setReportBusyId(null);
    if (!result.ok) {
      setReportsError(
        result.error === 'unauthorized'
          ? t('admin.reportsUnauthorized')
          : t('admin.reportsUnavailable')
      );
      return;
    }
    setSavedMsg(
      action === 'mask' ? t('admin.reportsMasked') : t('admin.reportsDismissed')
    );
    window.setTimeout(() => setSavedMsg(''), 2500);
    setReports((prev) => prev.filter((r) => r.playerId !== playerId));
  };

  return (
    <section className="admin">
      <header className="admin__header">
        <h2>{t('admin.title')}</h2>
        <p className="admin__hint">{t('admin.intro')}</p>
      </header>

      <div
        className="admin__tabs"
        role="tablist"
        aria-label={t('admin.tabsLabel')}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'questions'}
          className={`admin__tab${tab === 'questions' ? ' is-active' : ''}`}
          onClick={() => setTab('questions')}
        >
          {t('admin.tabQuestions')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'reports'}
          className={`admin__tab${tab === 'reports' ? ' is-active' : ''}`}
          onClick={() => setTab('reports')}
          data-testid="admin-tab-reports"
        >
          {t('admin.tabReports')}
        </button>
      </div>

      {tab === 'questions' && (
        <>
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
                  onChange={(e) =>
                    updateLocalized('explanation', 'fr', e.target.value)
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
                    updateLocalized('explanation', 'en', e.target.value)
                  }
                />
              </label>
            </div>
          )}
        </>
      )}

      {tab === 'reports' && (
        <div className="admin__reports" data-testid="admin-reports">
          <p className="admin__hint">{t('admin.reportsIntro')}</p>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => void loadReports()}
              disabled={reportsLoading}
            >
              {t('admin.reportsRefresh')}
            </button>
          </div>
          {reportsLoading && <p className="admin__hint">{t('common.loading')}</p>}
          {reportsError && <p className="admin__error">{reportsError}</p>}
          {!reportsLoading && !reportsError && reports.length === 0 && (
            <p className="admin__hint">{t('admin.reportsEmpty')}</p>
          )}
          {reports.length > 0 && (
            <ul className="admin__report-list">
              {reports.map((row) => (
                <li key={row.playerId} className="admin__report-row">
                  <div className="admin__report-meta">
                    <strong>{row.displayName}</strong>
                    <span className="admin__report-id">{row.playerId}</span>
                    <span>
                      {t('admin.reportsCount', { count: row.reportCount })}
                    </span>
                    <span className="admin__hint">
                      {new Date(row.lastReportedAt).toLocaleString()}
                    </span>
                    {row.reasons.length > 0 && (
                      <span className="admin__hint">
                        {row.reasons.join(' · ')}
                      </span>
                    )}
                  </div>
                  <div className="btn-row">
                    <button
                      type="button"
                      className="btn btn--primary btn--small"
                      disabled={reportBusyId === row.playerId}
                      onClick={() => void handleModerate('mask', row.playerId)}
                    >
                      {t('admin.reportsMask')}
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      disabled={reportBusyId === row.playerId}
                      onClick={() => void handleModerate('dismiss', row.playerId)}
                    >
                      {t('admin.reportsDismiss')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {savedMsg && (
        <p className="admin__status" role="status">
          {savedMsg}
        </p>
      )}

      <div className="btn-row admin__actions">
        {tab === 'questions' && (
          <>
            <button type="button" className="btn btn--primary" onClick={exportJson}>
              {t('admin.export')}
            </button>
            <button type="button" className="btn btn--ghost" onClick={applyPreview}>
              {t('admin.preview')}
            </button>
          </>
        )}
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
