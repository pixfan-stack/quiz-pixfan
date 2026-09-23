import { useTranslation } from 'react-i18next';
import { PlayerNamePrompt } from '../PlayerNameInput';
import { AccountSyncPanel } from '../AccountSyncPanel';
import { notificationsSupported } from '../../utils/dailyReminder';
import { downloadDailyChallengeIcs } from '../../utils/dailyChallengeCalendar';

interface QuizSettingsBarProps {
  recoveryCode?: string | null;
  onRecovered?: () => void;
  showSettings: boolean;
  setShowSettings: (value: boolean | ((prev: boolean) => boolean)) => void;
  timePerQuestion: number;
  setTimePerQuestion: (value: number) => void;
  antiCheat: boolean;
  setAntiCheat: (value: boolean | ((prev: boolean) => boolean)) => void;
  reminderOn: boolean;
  onToggleReminder: () => void;
  langCode: 'en' | 'fr';
}

export function QuizSettingsBar({
  recoveryCode,
  onRecovered,
  showSettings,
  setShowSettings,
  timePerQuestion,
  setTimePerQuestion,
  antiCheat,
  setAntiCheat,
  reminderOn,
  onToggleReminder,
  langCode,
}: QuizSettingsBarProps) {
  const { t } = useTranslation();

  return (
    <div className="quiz-settings-bar">
      <PlayerNamePrompt
        recoveryCode={recoveryCode}
        onRecovered={onRecovered}
      />
      <button
        type="button"
        className="btn btn--ghost btn--small"
        onClick={() => setShowSettings(!showSettings)}
        aria-expanded={showSettings}
      >
        ⚙️ {t('home.settings')}
      </button>

      {showSettings && (
        <div className="quiz-settings-panel">
          <div className="setting-row">
            <label htmlFor="timer-select" className="setting-label">
              {t('home.timerMode')}
            </label>
            <select
              id="timer-select"
              className="setting-select"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(Number(e.target.value))}
            >
              <option value={0}>{t('home.off')}</option>
              <option value={15}>15s</option>
              <option value={30}>30s</option>
              <option value={45}>45s</option>
              <option value={60}>60s</option>
            </select>
          </div>
          <div className="setting-row setting-row--stack">
            <label htmlFor="anticheat-toggle" className="setting-label">
              {t('home.antiCheat')}
            </label>
            <p className="setting-hint">{t('home.antiCheatHint')}</p>
            <button
              id="anticheat-toggle"
              type="button"
              className={`toggle-btn${antiCheat ? ' toggle-btn--on' : ''}`}
              onClick={() => setAntiCheat(!antiCheat)}
              role="switch"
              aria-checked={antiCheat}
            >
              {antiCheat ? 'ON' : 'OFF'}
            </button>
          </div>
          {notificationsSupported() && (
            <div className="setting-row setting-row--stack">
              <label htmlFor="daily-reminder-toggle" className="setting-label">
                {t('home.dailyReminder')}
              </label>
              <p className="setting-hint">{t('home.dailyReminderHint')}</p>
              <button
                id="daily-reminder-toggle"
                type="button"
                className={`toggle-btn${reminderOn ? ' toggle-btn--on' : ''}`}
                onClick={onToggleReminder}
                role="switch"
                aria-checked={reminderOn}
              >
                {reminderOn ? 'ON' : 'OFF'}
              </button>
            </div>
          )}
          <div className="setting-row setting-row--stack">
            <p className="setting-label">{t('home.addToCalendar')}</p>
            <p className="setting-hint">{t('home.addToCalendarHint')}</p>
            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={() =>
                downloadDailyChallengeIcs({
                  title: t('home.dailyChallenge'),
                  description: t('home.dailyChallengeDesc'),
                  lang: langCode,
                })
              }
            >
              {t('home.addToCalendar')}
            </button>
          </div>
          <div className="setting-row setting-row--stack setting-row--account-sync">
            <AccountSyncPanel
              initialCode={recoveryCode}
              onRecovered={onRecovered}
            />
          </div>
        </div>
      )}
    </div>
  );
}
