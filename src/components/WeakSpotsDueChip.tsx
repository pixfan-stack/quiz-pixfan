import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getDueMistakeCount,
  shouldShowWeakSpotsDueChip,
} from '../utils/mistakeVault';

interface WeakSpotsDueChipProps {
  onReview: () => void;
}

/**
 * Home surface for spaced-review dues (≥3) — pulls players into weak-spots.
 */
export function WeakSpotsDueChip({ onReview }: WeakSpotsDueChipProps) {
  const { t } = useTranslation();
  const [visible] = useState(() => shouldShowWeakSpotsDueChip());
  const [dueCount] = useState(() => getDueMistakeCount());

  if (!visible) return null;

  return (
    <div
      className="weak-spots-due-chip"
      role="region"
      aria-label={t('home.weakSpotsDueChip', { count: dueCount })}
    >
      <div className="weak-spots-due-chip__body">
        <p className="weak-spots-due-chip__title">
          {t('home.weakSpotsDueChip', { count: dueCount })}
        </p>
        <p className="weak-spots-due-chip__desc">
          {t('home.weakSpotsDueChipDesc')}
        </p>
      </div>
      <button
        type="button"
        className="btn btn--secondary btn--small"
        onClick={onReview}
      >
        {t('home.weakSpotsDueChipCta')}
      </button>
    </div>
  );
}
