import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  fetchAdminAnalytics,
  type AdminAnalyticsDashboard,
} from '../utils/adminAnalyticsApi';
import { parseAndValidateQuizzesJson } from '../utils/quizzesSchema';

interface AdminScreenProps {
  quizzes: Quiz[];
  onHome: () => void;
  /** Apply a session preview of edited data into the live quiz list. */
  onPreview: (quizzes: Quiz[]) => void;
}

type AdminTab = 'questions' | 'reports' | 'analytics';

/**
 * Admin: question editor + name-report moderation + analytics (PIN-gated).
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
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reports, setReports] = useState<AdminReportRow[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState('');
  const [reportBusyId, setReportBusyId] = useState<string | null>(null);

  const [analytics, setAnalytics] = useState<AdminAnalyticsDashboard | null>(
    null
  );
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');

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
          : result.error === 'pin_unconfigured'
            ? t('admin.pinUnconfigured')
            : t('admin.reportsUnavailable')
      );
      return;
    }
    setReports(result.reports);
  }, [t]);

  const loadAnalytics = useCallback(async () => {
    if (!getAdminSessionPin()) {
      setAnalyticsError(t('admin.analyticsUnauthorized'));
      return;
    }
    setAnalyticsLoading(true);
    setAnalyticsError('');
    const result = await fetchAdminAnalytics();
    setAnalyticsLoading(false);
    if (!result.ok || !result.data) {
      setAnalytics(null);
      setAnalyticsError(
        result.error === 'unauthorized'
          ? t('admin.analyticsUnauthorized')
          : result.error === 'pin_unconfigured'
            ? t('admin.pinUnconfigured')
            : t('admin.analyticsUnavailable')
      );
      return;
    }
    setAnalytics(result.data);
  }, [t]);

  useEffect(() => {
    if (unlocked && tab === 'reports') {
      void loadReports();
    }
  }, [unlocked, tab, loadReports]);

  useEffect(() => {
    if (unlocked && tab === 'analytics') {
      void loadAnalytics();
    }
  }, [unlocked, tab, loadAnalytics]);

  const activeQuiz = useMemo(
    () => draft.find((q) => q.id === quizId) ?? draft[0],
    [draft, quizId]
  );
  const question: Question | undefined = activeQuiz?.questions[questionIndex];

  const quizTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const q of draft) {
      map.set(q.id, pickLocale(q.title, lang));
    }
    return map;
  }, [draft, lang]);

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
            data-testid="admin-pin-input"
          />
          {error && (
            <p className="admin__error" data-testid="admin-pin-error">
              {error}
            </p>
          )}
          <div className="btn-row">
            <button
              type="submit"
              className="btn btn--primary"
              data-testid="admin-unlock"
            >
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

  const importJsonFile = async (file: File) => {
    setImportError('');
    let text: string;
    try {
      text = await file.text();
    } catch {
      setImportError(t('admin.importReadError'));
      return;
    }
    const result = parseAndValidateQuizzesJson(text);
    if (!result.ok) {
      const preview = result.issues
        .slice(0, 5)
        .map((issue) =>
          issue.path ? `${issue.path}: ${issue.message}` : issue.message
        )
        .join(' · ');
      setImportError(
        t('admin.importInvalid', {
          count: result.issues.length,
          detail: preview,
        })
      );
      return;
    }
    const next = cloneQuizzes(result.data.quizzes);
    setDraft(next);
    setQuizId(next[0]?.id ?? '');
    setQuestionIndex(0);
    setSavedMsg(
      t('admin.imported', { count: next.length })
    );
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
          : result.error === 'pin_unconfigured'
            ? t('admin.pinUnconfigured')
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
    <section className="admin" data-testid="admin-unlocked">
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
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'analytics'}
          className={`admin__tab${tab === 'analytics' ? ' is-active' : ''}`}
          onClick={() => setTab('analytics')}
          data-testid="admin-tab-analytics"
        >
          {t('admin.tabAnalytics')}
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

      {tab === 'analytics' && (
        <div className="admin__analytics" data-testid="admin-analytics">
          <p className="admin__hint">{t('admin.analyticsIntro')}</p>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => void loadAnalytics()}
              disabled={analyticsLoading}
            >
              {t('admin.analyticsRefresh')}
            </button>
          </div>
          {analyticsLoading && (
            <p className="admin__hint">{t('common.loading')}</p>
          )}
          {analyticsError && <p className="admin__error">{analyticsError}</p>}
          {analytics && !analyticsLoading && (
            <>
              <div className="admin__analytics-summary">
                <div className="admin__analytics-stat">
                  <span className="admin__analytics-stat__value">
                    {analytics.summary.totalAttempts}
                  </span>
                  <span className="admin__analytics-stat__label">
                    {t('admin.analyticsAttempts')}
                  </span>
                </div>
                <div className="admin__analytics-stat">
                  <span className="admin__analytics-stat__value">
                    {analytics.summary.avgPercentage}%
                  </span>
                  <span className="admin__analytics-stat__label">
                    {t('admin.analyticsAvgScore')}
                  </span>
                </div>
                <div className="admin__analytics-stat">
                  <span className="admin__analytics-stat__value">
                    {analytics.summary.uniqueQuizzes}
                  </span>
                  <span className="admin__analytics-stat__label">
                    {t('admin.analyticsQuizzes')}
                  </span>
                </div>
                <div className="admin__analytics-stat">
                  <span className="admin__analytics-stat__value">
                    {analytics.summary.ctaClicks}
                  </span>
                  <span className="admin__analytics-stat__label">
                    {t('admin.analyticsCta')}
                  </span>
                </div>
              </div>

              {(analytics.cta.byTarget.length > 0 ||
                analytics.cta.byTopic.length > 0) && (
                <div
                  className="admin__analytics-cta"
                  data-testid="admin-analytics-cta"
                >
                  <p className="admin__section-title">
                    {t('admin.analyticsCtaBreakdown')}
                  </p>
                  <p className="admin__hint">{t('admin.analyticsCtaHint')}</p>
                  <div className="admin__analytics-cta-grids">
                    {analytics.cta.byTarget.length > 0 && (
                      <div className="admin__analytics-table-wrap">
                        <table className="admin__analytics-table">
                          <thead>
                            <tr>
                              <th>{t('admin.analyticsColCtaTarget')}</th>
                              <th>{t('admin.analyticsColClicks')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.cta.byTarget.map((row) => (
                              <tr key={row.target}>
                                <td>
                                  <strong>
                                    {t(`admin.analyticsCtaTarget_${row.target}`)}
                                  </strong>
                                  <div className="admin__report-id">
                                    {row.target}
                                  </div>
                                </td>
                                <td>{row.clicks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {analytics.cta.byTopic.length > 0 && (
                      <div className="admin__analytics-table-wrap">
                        <table className="admin__analytics-table">
                          <thead>
                            <tr>
                              <th>{t('admin.analyticsColCtaTopic')}</th>
                              <th>{t('admin.analyticsColClicks')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.cta.byTopic.map((row) => (
                              <tr key={row.topic}>
                                <td>
                                  <strong>{row.topic}</strong>
                                </td>
                                <td>{row.clicks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  {analytics.cta.rows.length > 0 && (
                    <div className="admin__analytics-table-wrap">
                      <table className="admin__analytics-table">
                        <thead>
                          <tr>
                            <th>{t('admin.analyticsColCtaTarget')}</th>
                            <th>{t('admin.analyticsColCtaTopic')}</th>
                            <th>{t('admin.analyticsColCtaSource')}</th>
                            <th>{t('admin.analyticsColClicks')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.cta.rows.map((row) => (
                            <tr
                              key={`${row.target}:${row.topic}:${row.sourceQuizId}`}
                            >
                              <td>{row.target}</td>
                              <td>{row.topic}</td>
                              <td>
                                <span className="admin__report-id">
                                  {row.sourceQuizId}
                                </span>
                              </td>
                              <td>{row.clicks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {analytics.quizzes.length === 0 ? (
                <p className="admin__hint">{t('admin.analyticsEmpty')}</p>
              ) : (
                <div className="admin__analytics-table-wrap">
                  <table className="admin__analytics-table">
                    <thead>
                      <tr>
                        <th>{t('admin.analyticsColQuiz')}</th>
                        <th>{t('admin.analyticsColAttempts')}</th>
                        <th>{t('admin.analyticsColAvg')}</th>
                        <th>{t('admin.analyticsColTime')}</th>
                        <th>{t('admin.analyticsColLow')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.quizzes.map((row) => (
                        <tr key={row.quizId}>
                          <td>
                            <strong>
                              {quizTitleById.get(row.quizId) ?? row.quizId}
                            </strong>
                            <div className="admin__report-id">{row.quizId}</div>
                          </td>
                          <td>{row.attempts}</td>
                          <td>{row.avgPercentage}%</td>
                          <td>{row.avgTimeSeconds}s</td>
                          <td
                            className={
                              row.lowScoreRate >= 40
                                ? 'admin__analytics-low'
                                : undefined
                            }
                          >
                            {row.lowScoreRate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {analytics.recentDays.length > 0 && (
                <div className="admin__analytics-days">
                  <p className="admin__section-title">
                    {t('admin.analyticsRecent')}
                  </p>
                  <ul className="admin__analytics-day-list">
                    {analytics.recentDays.map((day) => (
                      <li key={day.day}>
                        <span>{day.day}</span>
                        <strong>{day.attempts}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {savedMsg && (
        <p className="admin__status" role="status">
          {savedMsg}
        </p>
      )}
      {importError && (
        <p className="admin__error" role="alert" data-testid="admin-import-error">
          {importError}
        </p>
      )}

      <div className="btn-row admin__actions">
        {tab === 'questions' && (
          <>
            <button
              type="button"
              className="btn btn--primary"
              onClick={exportJson}
              data-testid="admin-export"
            >
              {t('admin.export')}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => fileInputRef.current?.click()}
              data-testid="admin-import"
            >
              {t('admin.import')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="visually-hidden"
              data-testid="admin-import-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file) void importJsonFile(file);
              }}
            />
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
