import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createRecoveryCode,
  redeemRecoveryCode,
} from '../utils/accountSync';
import { isRemoteScoresEnabled } from '../utils/remoteScores';
import {
  normalizeRecoveryCode,
  recoveryMagicHash,
} from '../utils/recoveryCode';

type SyncStatus =
  | 'idle'
  | 'creating'
  | 'created'
  | 'redeeming'
  | 'redeemed'
  | 'error';

interface AccountSyncPanelProps {
  /** Prefill from magic-link `#/recover?c=…`. */
  initialCode?: string | null;
  /** Called after a successful redeem (e.g. clear hash / refresh UI). */
  onRecovered?: () => void;
  /** Open the redeem section immediately (magic link). */
  autoFocusRedeem?: boolean;
}

/**
 * Lightweight multi-device sync: generate / redeem a recovery code.
 * No OAuth — tied to the existing anonymous `playerId`.
 */
export function AccountSyncPanel({
  initialCode = null,
  onRecovered,
  autoFocusRedeem = false,
}: AccountSyncPanelProps) {
  const { t } = useTranslation();
  const codeInputId = useId();
  const redeemRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [draftCode, setDraftCode] = useState(() => initialCode ?? '');
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const enabled = isRemoteScoresEnabled();

  useEffect(() => {
    if (initialCode) {
      setDraftCode(initialCode);
    }
  }, [initialCode]);

  useEffect(() => {
    if (!autoFocusRedeem || !enabled) return;
    const id = window.setTimeout(() => redeemRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [autoFocusRedeem, enabled]);

  const mapError = useCallback(
    (err?: string) => {
      switch (err) {
        case 'invalid_code':
          return t('account.errInvalid');
        case 'unknown_code':
          return t('account.errUnknown');
        case 'expired_code':
          return t('account.errExpired');
        case 'remote_disabled':
          return t('account.errRemote');
        case 'network':
          return t('account.errNetwork');
        default:
          return t('account.errGeneric');
      }
    },
    [t]
  );

  const handleCreate = useCallback(async () => {
    setStatus('creating');
    setErrorKey(null);
    setCopied(null);
    const result = await createRecoveryCode();
    if (!result.ok || !result.code) {
      setStatus('error');
      setErrorKey(mapError(result.error));
      return;
    }
    setIssuedCode(result.code);
    setStatus('created');
  }, [mapError]);

  const handleRedeem = useCallback(async () => {
    const normalized = normalizeRecoveryCode(draftCode);
    if (!normalized) {
      setStatus('error');
      setErrorKey(mapError('invalid_code'));
      return;
    }
    setStatus('redeeming');
    setErrorKey(null);
    const result = await redeemRecoveryCode(normalized);
    if (!result.ok) {
      setStatus('error');
      setErrorKey(mapError(result.error));
      return;
    }
    setStatus('redeemed');
    onRecovered?.();
  }, [draftCode, mapError, onRecovered]);

  const copyText = useCallback(async (text: string, kind: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // ignore
    }
  }, []);

  if (!enabled) {
    return (
      <section className="account-sync account-sync--disabled">
        <h3 className="account-sync__title">{t('account.title')}</h3>
        <p className="account-sync__hint">{t('account.errRemote')}</p>
      </section>
    );
  }

  const magicUrl =
    issuedCode != null
      ? `${window.location.origin}${window.location.pathname}${recoveryMagicHash(issuedCode)}`
      : null;

  return (
    <section className="account-sync" aria-labelledby="account-sync-title">
      <h3 id="account-sync-title" className="account-sync__title">
        {t('account.title')}
      </h3>
      <p className="account-sync__hint">{t('account.hint')}</p>

      <div className="account-sync__block">
        <p className="account-sync__label">{t('account.createLabel')}</p>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => void handleCreate()}
          disabled={status === 'creating' || status === 'redeeming'}
        >
          {status === 'creating'
            ? t('account.creating')
            : t('account.createCode')}
        </button>

        {issuedCode && (
          <div className="account-sync__code-box">
            <code className="account-sync__code" aria-live="polite">
              {issuedCode}
            </code>
            <div className="account-sync__code-actions">
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => void copyText(issuedCode, 'code')}
              >
                {copied === 'code' ? t('account.copied') : t('account.copyCode')}
              </button>
              {magicUrl && (
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => void copyText(magicUrl, 'link')}
                >
                  {copied === 'link'
                    ? t('account.copied')
                    : t('account.copyLink')}
                </button>
              )}
            </div>
            <p className="account-sync__warn">{t('account.codeWarn')}</p>
          </div>
        )}
      </div>

      <div className="account-sync__block">
        <label htmlFor={codeInputId} className="account-sync__label">
          {t('account.redeemLabel')}
        </label>
        <input
          ref={redeemRef}
          id={codeInputId}
          type="text"
          className="account-sync__input"
          value={draftCode}
          spellCheck={false}
          autoCapitalize="characters"
          autoComplete="off"
          placeholder={t('account.redeemPlaceholder')}
          onChange={(e) => setDraftCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleRedeem();
            }
          }}
        />
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={() => void handleRedeem()}
          disabled={status === 'creating' || status === 'redeeming'}
        >
          {status === 'redeeming'
            ? t('account.redeeming')
            : t('account.redeem')}
        </button>
      </div>

      {status === 'redeemed' && (
        <p className="account-sync__success" role="status">
          {t('account.redeemSuccess')}
        </p>
      )}
      {status === 'error' && errorKey && (
        <p className="account-sync__error" role="alert">
          {errorKey}
        </p>
      )}
    </section>
  );
}
