import { useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getPlayerDisplayName,
  hasSeenNamePrompt,
  markNamePromptSeen,
  setPlayerDisplayName,
} from '../utils/player';

/**
 * Soft post-score name ask — no blocking modal on first home paint.
 * Skipped / saved marks the prompt seen so it does not nag forever.
 */
export function ResultNameSoftAsk() {
  const { t } = useTranslation();
  const inputId = useId();
  const [draft, setDraft] = useState('');
  const [visible, setVisible] = useState(
    () => !getPlayerDisplayName() && !hasSeenNamePrompt()
  );

  const dismiss = useCallback(() => {
    markNamePromptSeen();
    setVisible(false);
  }, []);

  const handleSave = useCallback(() => {
    setPlayerDisplayName(draft);
    markNamePromptSeen();
    setVisible(false);
  }, [draft]);

  if (!visible) return null;

  return (
    <div className="result-name-soft" data-testid="result-name-soft-ask" role="region">
      <p className="result-name-soft__title">{t('result.softAskTitle')}</p>
      <p className="result-name-soft__hint">{t('result.softAskHint')}</p>
      <label htmlFor={inputId} className="visually-hidden">
        {t('home.playerName')}
      </label>
      <input
        id={inputId}
        type="text"
        className="result-name-soft__input"
        value={draft}
        maxLength={24}
        placeholder={t('home.playerNamePlaceholder')}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          }
        }}
        autoComplete="nickname"
        name="quiz-player-name-soft"
      />
      <div className="result-name-soft__actions">
        <button type="button" className="btn btn--ghost btn--small" onClick={dismiss}>
          {t('result.softAskSkip')}
        </button>
        <button type="button" className="btn btn--primary btn--small" onClick={handleSave}>
          {t('result.softAskSave')}
        </button>
      </div>
    </div>
  );
}
