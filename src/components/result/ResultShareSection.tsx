import type { TFunction } from 'i18next';
import type { ExportImageFormat } from '../../utils/exportResult';
import type { SharePlatform } from '../../utils/share';
import { SHARE_PLATFORMS } from './sharePlatforms';

interface ResultShareSectionProps {
  isDaily: boolean;
  isDuel: boolean;
  quizzesLength: number;
  gridCopied: boolean;
  challengeCopied: boolean;
  linkCopied: boolean;
  shareFallbackCopied: boolean;
  onCopyDailyGrid: () => void;
  onChallengeFriend: () => void;
  onCopyDuelLink: () => void;
  onNativeShare: () => void;
  onExportImage: (format: ExportImageFormat) => void;
  onShare: (platform: SharePlatform) => void;
  t: TFunction;
}

export function ResultShareSection({
  isDaily,
  isDuel,
  quizzesLength,
  gridCopied,
  challengeCopied,
  linkCopied,
  shareFallbackCopied,
  onCopyDailyGrid,
  onChallengeFriend,
  onCopyDuelLink,
  onNativeShare,
  onExportImage,
  onShare,
  t,
}: ResultShareSectionProps) {
  return (
    <div className="share-section">
      <h3 className="share-section__title">{t('result.shareTitle')}</h3>

      <div className="share-primary">
        {isDaily ? (
          <>
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => void onCopyDailyGrid()}
            >
              <span className="btn__icon" aria-hidden="true">
                ▦
              </span>
              {gridCopied
                ? t('result.copyDailyPrimaryDone')
                : t('result.copyDailyPrimary')}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--block"
              onClick={() => void onExportImage('square')}
            >
              <span className="btn__icon" aria-hidden="true">
                ⬜
              </span>
              {t('result.exportImage')}
            </button>
            {quizzesLength > 0 && (
              <button
                type="button"
                className="btn btn--ghost btn--block"
                onClick={() => void onChallengeFriend()}
              >
                <span className="btn__icon" aria-hidden="true">
                  ⚔️
                </span>
                {challengeCopied
                  ? t('result.challengeLinkCopied')
                  : t('result.challengeFriend')}
              </button>
            )}
          </>
        ) : isDuel ? (
          <>
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => void onCopyDuelLink()}
            >
              <span className="btn__icon" aria-hidden="true">
                ⚔️
              </span>
              {linkCopied
                ? t('result.linkCopied')
                : t('result.sendDuelLink')}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--block"
              onClick={() => void onNativeShare()}
            >
              <span className="btn__icon" aria-hidden="true">
                ↗
              </span>
              {shareFallbackCopied
                ? t('result.linkCopied')
                : t('result.sharePrimary')}
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={() => void onExportImage('square')}
            >
              <span className="btn__icon" aria-hidden="true">
                ⬜
              </span>
              {t('result.exportImage')}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => void onNativeShare()}
            >
              <span className="btn__icon" aria-hidden="true">
                ↗
              </span>
              {shareFallbackCopied
                ? t('result.linkCopied')
                : t('result.sharePrimary')}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--block"
              onClick={() => void onExportImage('square')}
            >
              <span className="btn__icon" aria-hidden="true">
                ⬜
              </span>
              {t('result.exportImage')}
            </button>
            {quizzesLength > 0 && (
              <button
                type="button"
                className="btn btn--ghost btn--block"
                onClick={() => void onChallengeFriend()}
              >
                <span className="btn__icon" aria-hidden="true">
                  ⚔️
                </span>
                {challengeCopied
                  ? t('result.challengeLinkCopied')
                  : t('result.challengeFriend')}
              </button>
            )}
          </>
        )}
      </div>

      <details className="share-more">
        <summary className="share-more__summary">
          {t('result.shareMore')}
        </summary>
        <div className="export-section">
          <p className="export-section__hint">{t('result.exportSquareHint')}</p>
          <button
            type="button"
            className="btn btn--ghost btn--block"
            onClick={() => void onExportImage('story')}
          >
            <span className="btn__icon" aria-hidden="true">
              ▢
            </span>
            {t('result.exportStory')}
          </button>
        </div>
        <p className="share-section__platforms-label">
          {t('result.shareAlso')}
        </p>
        <div className="share-grid">
          {SHARE_PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`btn share-btn ${p.className}`}
              onClick={() => onShare(p.id)}
            >
              <span className="btn__icon" aria-hidden="true">
                {p.icon}
              </span>
              {t(p.labelKey)}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
