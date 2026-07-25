import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'quiz-pixfan-install-dismissed';

/**
 * Optional PWA install banner when the browser fires beforeinstallprompt.
 */
export function InstallPrompt() {
  const { t } = useTranslation();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!visible || !deferred) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
    setDeferred(null);
  };

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  };

  return (
    <div className="install-prompt" role="region" aria-label={t('pwa.installTitle')}>
      <div className="install-prompt__body">
        <p className="install-prompt__title">{t('pwa.installTitle')}</p>
        <p className="install-prompt__desc">{t('pwa.installDesc')}</p>
      </div>
      <div className="install-prompt__actions">
        <button type="button" className="btn btn--primary btn--small" onClick={() => void install()}>
          {t('pwa.install')}
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={dismiss}>
          {t('pwa.dismiss')}
        </button>
      </div>
    </div>
  );
}
