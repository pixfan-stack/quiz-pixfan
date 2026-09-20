import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getPlayerDisplayName,
  setPlayerDisplayName,
} from '../utils/player';
import { AccountSyncPanel } from './AccountSyncPanel';

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

interface PlayerNamePromptProps {
  /** Prefill recovery from magic link. */
  recoveryCode?: string | null;
  onRecovered?: () => void;
}

/**
 * Startup modal for the leaderboard display name + compact chip to edit later.
 * Also hosts light multi-device sync (recovery code).
 */
export function PlayerNamePrompt({
  recoveryCode = null,
  onRecovered,
}: PlayerNamePromptProps = {}) {
  const { t } = useTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [displayName, setDisplayName] = useState(() => getPlayerDisplayName());
  const [draft, setDraft] = useState(() => getPlayerDisplayName());
  const [open, setOpen] = useState(
    () =>
      Boolean(recoveryCode) ||
      (!getPlayerDisplayName() && !hasSeenPrompt())
  );
  const [showSync, setShowSync] = useState(() => Boolean(recoveryCode));

  useEffect(() => {
    if (recoveryCode) {
      setOpen(true);
      setShowSync(true);
    }
  }, [recoveryCode]);

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
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusables = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleSkip, showSync]);

  const openEditor = () => {
    setDraft(getPlayerDisplayName());
    setOpen(true);
  };

  const handleRecovered = () => {
    setDisplayName(getPlayerDisplayName());
    onRecovered?.();
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
            ref={dialogRef}
            className="player-modal__dialog player-modal__dialog--wide"
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

            <button
              type="button"
              className="account-sync-toggle"
              aria-expanded={showSync}
              onClick={() => setShowSync((v) => !v)}
            >
              {showSync ? t('account.hideSync') : t('account.showSync')}
            </button>

            {showSync && (
              <AccountSyncPanel
                initialCode={recoveryCode}
                autoFocusRedeem={Boolean(recoveryCode)}
                onRecovered={handleRecovered}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
