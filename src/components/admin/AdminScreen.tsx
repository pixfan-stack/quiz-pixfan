import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Question, Quiz, QuizzesData } from '../../types/quiz';
import { pickLocale } from '../../utils/locale';
import {
  getAdminSessionPin,
  isAdminEnabled,
  isAdminUnlocked,
  lockAdmin,
  unlockAdmin,
} from '../../utils/adminAuth';
import {
  fetchAdminReports,
  moderateAdminReport,
  type AdminReportRow,
} from '../../utils/adminReportsApi';
import {
  fetchAdminAnalytics,
  type AdminAnalyticsDashboard,
} from '../../utils/adminAnalyticsApi';
import { parseAndValidateQuizzesJson } from '../../utils/quizzesSchema';
import { AdminActionsBar } from './AdminActionsBar';
import { AdminAnalyticsPanel } from './AdminAnalyticsPanel';
import { AdminPinGate } from './AdminPinGate';
import { AdminQuestionsPanel } from './AdminQuestionsPanel';
import { AdminReportsPanel } from './AdminReportsPanel';
import type { AdminScreenProps, AdminTab } from './types';

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
    return <AdminPinGate mode="disabled" onHome={onHome} />;
  }

  if (!unlocked) {
    return (
      <AdminPinGate
        mode="locked"
        pin={pin}
        error={error}
        onPinChange={setPin}
        onUnlock={() => {
          if (unlockAdmin(pin)) {
            setUnlocked(true);
            setError('');
          } else {
            setError(t('admin.pinError'));
          }
        }}
        onHome={onHome}
      />
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

  const updateAnswerText = (
    answerId: string,
    locale: 'en' | 'fr',
    value: string
  ) => {
    if (!question) return;
    updateQuestion({
      answers: question.answers.map((a) =>
        a.id === answerId
          ? { ...a, text: { ...a.text, [locale]: value } }
          : a
      ),
    });
  };

  const flashStatus = (msg: string) => {
    setSavedMsg(msg);
    window.setTimeout(() => setSavedMsg(''), 2500);
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
    flashStatus(t('admin.exported'));
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
    flashStatus(t('admin.imported', { count: next.length }));
  };

  const applyPreview = () => {
    onPreview(cloneQuizzes(draft));
    flashStatus(t('admin.previewApplied'));
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
    flashStatus(
      action === 'mask' ? t('admin.reportsMasked') : t('admin.reportsDismissed')
    );
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
        <AdminQuestionsPanel
          draft={draft}
          activeQuiz={activeQuiz}
          question={question}
          questionIndex={questionIndex}
          lang={lang}
          onQuizIdChange={(id) => {
            setQuizId(id);
            setQuestionIndex(0);
          }}
          onQuestionIndexChange={setQuestionIndex}
          onUpdateQuestion={updateQuestion}
          onUpdateLocalized={updateLocalized}
          onUpdateAnswerText={updateAnswerText}
        />
      )}

      {tab === 'reports' && (
        <AdminReportsPanel
          reports={reports}
          loading={reportsLoading}
          error={reportsError}
          busyId={reportBusyId}
          onRefresh={() => void loadReports()}
          onModerate={(action, playerId) =>
            void handleModerate(action, playerId)
          }
        />
      )}

      {tab === 'analytics' && (
        <AdminAnalyticsPanel
          analytics={analytics}
          loading={analyticsLoading}
          error={analyticsError}
          quizTitleById={quizTitleById}
          onRefresh={() => void loadAnalytics()}
        />
      )}

      {savedMsg && (
        <p className="admin__status" role="status">
          {savedMsg}
        </p>
      )}
      {importError && (
        <p
          className="admin__error"
          role="alert"
          data-testid="admin-import-error"
        >
          {importError}
        </p>
      )}

      <AdminActionsBar
        tab={tab}
        fileInputRef={fileInputRef}
        onExport={exportJson}
        onImportFile={(file) => void importJsonFile(file)}
        onPreview={applyPreview}
        onLock={() => {
          lockAdmin();
          setUnlocked(false);
          onHome();
        }}
      />
    </section>
  );
}
