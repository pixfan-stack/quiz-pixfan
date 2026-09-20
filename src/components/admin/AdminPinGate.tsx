import { useTranslation } from 'react-i18next';

interface AdminDisabledProps {
  mode: 'disabled';
  onHome: () => void;
}

interface AdminLockedProps {
  mode: 'locked';
  pin: string;
  error: string;
  onPinChange: (value: string) => void;
  onUnlock: () => void;
  onHome: () => void;
}

type AdminPinGateProps = AdminDisabledProps | AdminLockedProps;

/**
 * Admin gate: feature-disabled message or PIN unlock form.
 */
export function AdminPinGate(props: AdminPinGateProps) {
  const { t } = useTranslation();
  const { mode, onHome } = props;

  if (mode === 'disabled') {
    return (
      <section className="admin">
        <h2>{t('admin.title')}</h2>
        <p>{t('admin.disabled')}</p>
        <button type="button" className="btn btn--secondary" onClick={onHome}>
          {t('result.backHome')}
        </button>
      </section>
    );
  }

  const { pin, error, onPinChange, onUnlock } = props;

  return (
    <section className="admin">
      <h2>{t('admin.title')}</h2>
      <p className="admin__hint">{t('admin.pinHint')}</p>
      <form
        className="admin__pin-form"
        onSubmit={(e) => {
          e.preventDefault();
          onUnlock();
        }}
      >
        <label className="setting-label" htmlFor="admin-pin">
          {t('admin.pin')}
        </label>
        <input
          id="admin-pin"
          type="password"
          className="setting-select admin__pin-input"
          value={pin}
          onChange={(e) => onPinChange(e.target.value)}
          autoComplete="current-password"
          data-testid="admin-pin-input"
        />
        {error && (
          <p className="admin__error" data-testid="admin-pin-error">
            {error}
          </p>
        )}
        <div className="btn-row">
          <button
            type="submit"
            className="btn btn--primary"
            data-testid="admin-unlock"
          >
            {t('admin.unlock')}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onHome}>
            {t('result.backHome')}
          </button>
        </div>
      </form>
    </section>
  );
}
