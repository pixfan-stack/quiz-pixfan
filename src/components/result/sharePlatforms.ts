import type { SharePlatform } from '../../utils/share';

export const SHARE_PLATFORMS: {
  id: SharePlatform;
  labelKey: string;
  className: string;
  icon: string;
}[] = [
  {
    id: 'twitter',
    labelKey: 'result.share_twitter',
    className: 'share-btn--twitter',
    icon: '𝕏',
  },
  {
    id: 'facebook',
    labelKey: 'result.share_facebook',
    className: 'share-btn--facebook',
    icon: 'f',
  },
  {
    id: 'linkedin',
    labelKey: 'result.share_linkedin',
    className: 'share-btn--linkedin',
    icon: 'in',
  },
  {
    id: 'whatsapp',
    labelKey: 'result.share_whatsapp',
    className: 'share-btn--whatsapp',
    icon: '☎',
  },
];
