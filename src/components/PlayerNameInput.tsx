import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getPlayerDisplayName,
  setPlayerDisplayName,
} from '../utils/player';

const PROMPT_SEEN_KEY = 'quiz-pixfan-name-prompt-seen';

function hasSeenPrompt(): boolean {
  try {
    return localStorage.getItem(PROMPT_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markPromptSeen(): void {
  try {
    localStorage.setItem(PROMPT_SEEN_KEY, '1');
  } catch {
    // private mode
  }
}

/**
 * Startup modal for the leaderboard display name + compact chip to edit later.
 */
export function PlayerNamePrompt() {
  const { t } = useTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(() => getPlayerDisplayName());
  const [draft, setDraft] = useState(() => getPlayerDisplayName());
  const [open, setOpen] = useState(() => !getPlayerDisplayName() && !hasSeenPrompt());

  const close = useCallback(() => {
    markPromptSeen();
    setOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    setPlayerDisplayName(draft);
    setDisplayName(getPlayerDisplayName());
    close();
  }, [draft, close]);

  const handleSkip = useCallback(() => {
    close();
  }, [close]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleSkip]);

  const openEditor = () => {
    setDraft(getPlayerDisplayName());
    setOpen(true);
  };

  return (
    <>
      <div className="player-chip-bar">
        <button
          type="button"
          className="player-chip"
          onClick={openEditor}
          aria-haspopup="dialog"
        >
          <span className="player-chip__label">{t('home.playerName')}</span>
          <span className="player-chip__value">
            {displayName || t('home.playerNameUnset')}
          </span>
          <span className="player-chip__edit" aria-hidden="true">
            ✎
          </span>
        </button>
      </div>

      {open && (
        <div
          className="player-modal"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleSkip();
          }}
        >
          <div
            className="player-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-modal-title"
          >
            <h2 id="player-modal-title" className="player-modal__title">
              {t('home.playerModalTitle')}
            </h2>
            <p className="player-modal__hint">{t('home.playerNameHint')}</p>

            <label htmlFor={inputId} className="visually-hidden">
              {t('home.playerName')}
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              className="player-modal__input"
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
              name="quiz-player-name"
            />

            <div className="player-modal__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleSkip}
              >
                {t('home.playerModalSkip')}
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleSave}
              >
                {t('home.playerModalSave')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
