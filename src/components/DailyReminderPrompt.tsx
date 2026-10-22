import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toContentLang } from '../utils/lang';
import { downloadDailyChallengeIcs } from '../utils/dailyChallengeCalendar';
import {
  dismissDailyReminderPrompt,
  notificationsSupported,
  requestDailyReminderPermission,
  shouldShowDailyReminderPrompt,
} from '../utils/dailyReminder';

/**
 * Soft post-daily banner: enable local reminder and/or download .ics.
 * Settings still own the permanent toggles — this is the conversion surface.
 */
export function DailyReminderPrompt() {
  const { t, i18n } = useTranslation();
  const langCode = toContentLang(i18n.resolvedLanguage ?? i18n.language);
  const [visible, setVisible] = useState(() => shouldShowDailyReminderPrompt());
  const canNotify = notificationsSupported();

  if (!visible) return null;

  const dismiss = () => {
    dismissDailyReminderPrompt();
    setVisible(false);
  };

  const enableReminder = () => {
    void (async () => {
      const ok = await requestDailyReminderPermission();
      if (ok) dismiss();
    })();
  };

  const addToCalendar = () => {
    downloadDailyChallengeIcs({
      title: t('home.dailyChallenge'),
      description: t('home.dailyChallengeDesc'),
      lang: langCode,
    });
    dismiss();
  };

  return (
    <div
      className="daily-reminder-prompt"
      role="region"
      aria-label={t('result.reminderPromptTitle')}
      data-testid="daily-reminder-prompt"
    >
      <div className="daily-reminder-prompt__body">
        <p className="daily-reminder-prompt__title">
          {t('result.reminderPromptTitle')}
        </p>
        <p className="daily-reminder-prompt__desc">
          {t('result.reminderPromptDesc')}
        </p>
      </div>
      <div className="daily-reminder-prompt__actions">
        {canNotify ? (
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={enableReminder}
          >
            {t('result.reminderPromptEnable')}
          </button>
        ) : null}
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={addToCalendar}
        >
          {t('result.reminderPromptIcs')}
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={dismiss}
        >
          {t('result.reminderPromptDismiss')}
        </button>
      </div>
    </div>
  );
}
