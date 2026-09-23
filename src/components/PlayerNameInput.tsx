import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getPlayerDisplayName,
  setPlayerDisplayName,
} from '../utils/player';
import { AccountSyncPanel } from './AccountSyncPanel';

const PROMPT_SEEN_KEY = 'quiz-pixfan-name-prompt-seen';
/** Custom event — footer / settings can open the sync surface. */
export const OPEN_ACCOUNT_SYNC_EVENT = 'quiz-pixfan-open-account-sync';

export function requestOpenAccountSync(): void {
  window.dispatchEvent(new CustomEvent(OPEN_ACCOUNT_SYNC_EVENT));
}

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

type ModalMode = 'name' | 'sync';

interface PlayerNamePromptProps {
  /** Prefill recovery from magic link. */
  recoveryCode?: string | null;
  onRecovered?: () => void;
}

/**
 * Startup modal for the leaderboard display name + visible sync chip.
 * Sync also opens from settings / footer via `requestOpenAccountSync`.
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
  const [modalMode, setModalMode] = useState<ModalMode>(() =>
    recoveryCode ? 'sync' : 'name'
  );
  const [showSyncInName, setShowSyncInName] = useState(() =>
    Boolean(recoveryCode)
  );

  useEffect(() => {
    if (recoveryCode) {
      setModalMode('sync');
      setOpen(true);
      setShowSyncInName(true);
    }
  }, [recoveryCode]);

  useEffect(() => {
    const onOpenSync = () => {
      setModalMode('sync');
      setOpen(true);
    };
    window.addEventListener(OPEN_ACCOUNT_SYNC_EVENT, onOpenSync);
    return () => window.removeEventListener(OPEN_ACCOUNT_SYNC_EVENT, onOpenSync);
  }, []);

  const close = useCallback(() => {
    markPromptSeen();
    setOpen(false);
    setModalMode('name');
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
    const id = window.setTimeout(() => {
      if (modalMode === 'name') inputRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(id);
  }, [open, modalMode]);

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
  }, [open, handleSkip, modalMode, showSyncInName]);

  const openEditor = () => {
    setDraft(getPlayerDisplayName());
    setModalMode('name');
    setOpen(true);
  };

  const openSync = () => {
    setModalMode('sync');
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
        <button
          type="button"
          className="player-chip player-chip--sync"
          onClick={openSync}
          aria-haspopup="dialog"
        >
          {t('account.saveProgress')}
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
            {modalMode === 'sync' ? (
              <>
                <h2 id="player-modal-title" className="player-modal__title">
                  {t('account.saveProgressTitle')}
                </h2>
                <AccountSyncPanel
                  initialCode={recoveryCode}
                  autoFocusRedeem={Boolean(recoveryCode)}
                  onRecovered={handleRecovered}
                />
                <div className="player-modal__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={handleSkip}
                  >
                    {t('account.closeSync')}
                  </button>
                </div>
              </>
            ) : (
              <>
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
                  aria-expanded={showSyncInName}
                  onClick={() => setShowSyncInName((v) => !v)}
                >
                  {showSyncInName
                    ? t('account.hideSync')
                    : t('account.showSync')}
                </button>

                {showSyncInName && (
                  <AccountSyncPanel
                    initialCode={recoveryCode}
                    autoFocusRedeem={Boolean(recoveryCode)}
                    onRecovered={handleRecovered}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
