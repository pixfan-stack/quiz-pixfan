import { useCallback, useState } from 'react';
import type { TFunction } from 'i18next';
import type { Quiz, QuizResult } from '../../types/quiz';
import {
  buildDailyResultShareBlock,
  formatResultShareGrid,
} from '../../utils/resultShareGrid';
import {
  copySharePayload,
  nativeShareScore,
  openShare,
  socialShareUrl,
  resolveShareKind,
  shareOrCopy,
  shareTextKey,
  type SharePlatform,
} from '../../utils/share';
import {
  exportResultAsImage,
  downloadResultImage,
  shareResultImage,
  type ExportImageFormat,
} from '../../utils/exportResult';
import {
  buildDuelQuiz,
  createDuelSeed,
} from '../../utils/duel';
import type { LangCode } from './types';

interface UseResultShareActionsArgs {
  result: QuizResult;
  quiz: Quiz;
  quizTitle: string;
  langCode: LangCode;
  quizzes: Quiz[];
  t: TFunction;
}

export function useResultShareActions({
  result,
  quiz,
  quizTitle,
  langCode,
  quizzes,
  t,
}: UseResultShareActionsArgs) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [challengeCopied, setChallengeCopied] = useState(false);
  const [shareFallbackCopied, setShareFallbackCopied] = useState(false);
  const [gridCopied, setGridCopied] = useState(false);

  const shareKind = resolveShareKind(result.quizId);
  const shareUrl = socialShareUrl(result.quizId, {
    score: result.percentage,
    lang: langCode,
  });
  const shareGrid = formatResultShareGrid(result.answerMarks ?? []);
  const shareText = t(shareTextKey(shareKind), {
    score: result.correctCount,
    total: result.totalQuestions,
    percent: result.percentage,
    quizTitle,
  });
  const shareHashtags = t('share.hashtags');

  const buildScorePayload = useCallback(
    () => ({
      text: shareGrid ? `${shareText}\n${shareGrid}` : shareText,
      url: shareUrl,
      hashtags: shareHashtags,
    }),
    [shareText, shareUrl, shareHashtags, shareGrid]
  );

  const handleCopyDailyGrid = useCallback(async () => {
    const dateLabel = result.quizId.replace(/^daily-/, '');
    const block = buildDailyResultShareBlock({
      dateLabel,
      percent: result.percentage,
      marks: result.answerMarks ?? [],
      url: shareUrl,
      lang: langCode,
    });
    try {
      await navigator.clipboard.writeText(block);
      setGridCopied(true);
      window.setTimeout(() => setGridCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [
    langCode,
    result.answerMarks,
    result.percentage,
    result.quizId,
    shareUrl,
  ]);

  const handleShare = (platform: SharePlatform) => {
    openShare(platform, buildScorePayload());
  };

  const handleNativeShare = useCallback(async () => {
    const payload = buildScorePayload();
    const outcome = await nativeShareScore(payload, t('app.title'));
    if (outcome === 'shared' || outcome === 'aborted') return;
    const ok = await copySharePayload(payload);
    if (ok) {
      setShareFallbackCopied(true);
      window.setTimeout(() => setShareFallbackCopied(false), 2000);
    }
  }, [buildScorePayload, t]);

  const handleCopyDuelLink = useCallback(async () => {
    const payload = {
      text: t(shareTextKey('duel'), {
        score: result.correctCount,
        total: result.totalQuestions,
        percent: result.percentage,
        quizTitle,
      }),
      url: shareUrl,
      hashtags: shareHashtags,
    };
    const outcome = await shareOrCopy(payload, t('app.title'));
    if (outcome === 'shared' || outcome === 'copied') {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    }
  }, [
    shareUrl,
    shareHashtags,
    t,
    result.correctCount,
    result.totalQuestions,
    result.percentage,
    quizTitle,
  ]);

  const handleChallengeFriend = useCallback(async () => {
    if (quizzes.length === 0) return;
    const seed = createDuelSeed();
    const duel = buildDuelQuiz(quizzes, seed);
    const url = socialShareUrl(duel.id, {
      score: result.percentage,
      lang: langCode,
    });
    const text = t(shareTextKey('challenge'), {
      score: result.correctCount,
      total: result.totalQuestions,
      percent: result.percentage,
      quizTitle,
    });
    const payload = { text, url, hashtags: t('share.hashtags') };

    const outcome = await shareOrCopy(payload, t('app.title'));
    if (outcome === 'shared' || outcome === 'copied') {
      setChallengeCopied(true);
      window.setTimeout(() => setChallengeCopied(false), 2500);
    } else if (outcome === 'failed') {
      openShare('whatsapp', payload);
    }
  }, [
    quizzes,
    t,
    result.correctCount,
    result.totalQuestions,
    result.percentage,
    quizTitle,
    langCode,
  ]);

  const handleExportImage = useCallback(
    async (format: ExportImageFormat) => {
      try {
        const blob = await exportResultAsImage(result, quiz, langCode, format);
        const payload = buildScorePayload();
        const shared = await shareResultImage(blob, {
          title: t('app.title'),
          text: payload.text,
          url: payload.url,
          fileName: `quiz-pixfan-${format}.png`,
        });
        if (!shared) {
          downloadResultImage(blob, quiz.id, format);
        }
      } catch {
        // Silently fail — not critical
      }
    },
    [result, quiz, langCode, t, buildScorePayload]
  );

  return {
    shareKind,
    shareUrl,
    shareGrid,
    shareText,
    shareHashtags,
    linkCopied,
    challengeCopied,
    shareFallbackCopied,
    gridCopied,
    handleCopyDailyGrid,
    handleShare,
    handleNativeShare,
    handleCopyDuelLink,
    handleChallengeFriend,
    handleExportImage,
  };
}
