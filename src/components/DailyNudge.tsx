import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  dismissHomeDailyNudge,
  shouldShowHomeDailyNudge,
} from '../utils/reengage';

interface DailyNudgeProps {
  onPlayDaily: () => void;
}

/**
 * Soft PWA home reminder to play today’s daily challenge.
 */
export function DailyNudge({ onPlayDaily }: DailyNudgeProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => shouldShowHomeDailyNudge());

  if (!visible) return null;

  const dismiss = () => {
    dismissHomeDailyNudge();
    setVisible(false);
  };

  return (
    <div
      className="daily-nudge"
      role="region"
      aria-label={t('home.dailyNudgeTitle')}
      data-testid="daily-nudge"
    >
      <div className="daily-nudge__body">
        <p className="daily-nudge__title">{t('home.dailyNudgeTitle')}</p>
        <p className="daily-nudge__desc">{t('home.dailyNudgeDesc')}</p>
      </div>
      <div className="daily-nudge__actions">
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={() => {
            dismiss();
            onPlayDaily();
          }}
        >
          {t('home.dailyNudgePlay')}
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={dismiss}>
          {t('home.dailyNudgeDismiss')}
        </button>
      </div>
    </div>
  );
}
