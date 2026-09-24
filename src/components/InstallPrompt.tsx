import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trackHabitEvent } from '../utils/analyticsApi';
import {
  isStandalonePwa,
  shouldShowIosInstallHint,
} from '../utils/reengage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'quiz-pixfan-install-dismissed';

type PromptMode = 'chromium' | 'ios';

/**
 * PWA install banner:
 * - Chromium: native `beforeinstallprompt`
 * - iOS Safari: manual Share → Add to Home Screen hint (no bip event)
 */
export function InstallPrompt() {
  const { t } = useTranslation();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [mode, setMode] = useState<PromptMode | null>(null);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === '1') return;
    if (isStandalonePwa()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setMode('chromium');
    };

    window.addEventListener('beforeinstallprompt', onPrompt);

    // iOS never fires beforeinstallprompt — show a soft how-to instead.
    if (shouldShowIosInstallHint()) {
      setMode('ios');
    }

    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (mode === null) return null;
  if (mode === 'chromium' && !deferred) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setMode(null);
    setDeferred(null);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') {
      void trackHabitEvent('pwa_install');
    }
    dismiss();
  };

  const isIos = mode === 'ios';

  return (
    <div
      className="install-prompt"
      role="region"
      aria-label={t(isIos ? 'pwa.iosInstallTitle' : 'pwa.installTitle')}
    >
      <div className="install-prompt__body">
        <p className="install-prompt__title">
          {t(isIos ? 'pwa.iosInstallTitle' : 'pwa.installTitle')}
        </p>
        <p className="install-prompt__desc">
          {t(isIos ? 'pwa.iosInstallDesc' : 'pwa.installDesc')}
        </p>
      </div>
      <div className="install-prompt__actions">
        {isIos ? (
          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={dismiss}
          >
            {t('pwa.iosInstallGotIt')}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={() => void install()}
          >
            {t('pwa.install')}
          </button>
        )}
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={dismiss}
        >
          {t('pwa.dismiss')}
        </button>
      </div>
    </div>
  );
}
