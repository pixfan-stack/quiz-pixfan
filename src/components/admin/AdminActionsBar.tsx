import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import type { AdminTab } from './types';

interface AdminActionsBarProps {
  tab: AdminTab;
  fileInputRef: RefObject<HTMLInputElement>;
  onExport: () => void;
  onImportFile: (file: File) => void;
  onPreview: () => void;
  onLock: () => void;
}

/**
 * Bottom admin actions: export / import / preview (questions tab) + lock.
 */
export function AdminActionsBar({
  tab,
  fileInputRef,
  onExport,
  onImportFile,
  onPreview,
  onLock,
}: AdminActionsBarProps) {
  const { t } = useTranslation();

  return (
    <div className="btn-row admin__actions">
      {tab === 'questions' && (
        <>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onExport}
            data-testid="admin-export"
          >
            {t('admin.export')}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => fileInputRef.current?.click()}
            data-testid="admin-import"
          >
            {t('admin.import')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            data-testid="admin-import-input"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) onImportFile(file);
            }}
          />
          <button type="button" className="btn btn--ghost" onClick={onPreview}>
            {t('admin.preview')}
          </button>
        </>
      )}
      <button type="button" className="btn btn--secondary" onClick={onLock}>
        {t('admin.lock')}
      </button>
    </div>
  );
}
