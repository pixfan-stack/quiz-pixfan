import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const langCode = (i18n.resolvedLanguage ?? i18n.language).startsWith('fr')
    ? 'fr'
    : 'en';
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
      className="reengage-banner daily-reminder-prompt"
      role="region"
      aria-label={t('result.reminderPromptTitle')}
    >
      <div className="reengage-banner__body">
        <p className="reengage-banner__title">
          {t('result.reminderPromptTitle')}
        </p>
        <p className="reengage-banner__desc">
          {t('result.reminderPromptDesc')}
        </p>
      </div>
      <div className="reengage-banner__actions">
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
