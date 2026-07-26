/**
 * Utility: Export quiz results as a shareable image.
 * Uses Canvas API — PixFan pink branding, score hook, site URL.
 */

import type { Quiz, QuizResult } from '../types/quiz';
import { APP_SHARE_URL } from './share';

export type ExportImageFormat = 'square' | 'story';

const COLORS = {
  bgTop: '#1a1a2e',
  bgBottom: '#3a1528',
  pink: '#f3538c',
  pinkSoft: 'rgba(243, 83, 140, 0.35)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.72)',
  textSoft: 'rgba(255,255,255,0.45)',
  success: '#34d399',
  ringTrack: 'rgba(255,255,255,0.12)',
};

const FORMAT_SIZE: Record<ExportImageFormat, { width: number; height: number }> =
  {
    square: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1920 },
  };

function displayHost(): string {
  try {
    return new URL(APP_SHARE_URL).host;
  } catch {
    return 'quiz.pixfan.fr';
  }
}

function truncate(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) {
    t = t.slice(0, -1);
  }
  return `${t}…`;
}

export async function exportResultAsImage(
  result: QuizResult,
  quiz: Quiz,
  lang: 'en' | 'fr' = 'en',
  format: ExportImageFormat = 'square'
): Promise<Blob> {
  const { width, height } = FORMAT_SIZE[format];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const isFr = lang === 'fr';
  const isStory = format === 'story';

  // Background
  const grad = ctx.createLinearGradient(0, 0, width * 0.2, height);
  grad.addColorStop(0, COLORS.bgTop);
  grad.addColorStop(1, COLORS.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Soft pink glow
  const glow = ctx.createRadialGradient(
    width * 0.5,
    height * (isStory ? 0.38 : 0.42),
    40,
    width * 0.5,
    height * (isStory ? 0.38 : 0.42),
    width * 0.55
  );
  glow.addColorStop(0, COLORS.pinkSoft);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Brand
  ctx.fillStyle = COLORS.pink;
  ctx.font = '700 34px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Quiz PixFan', width / 2, isStory ? 160 : 100);

  // Heading
  ctx.fillStyle = COLORS.text;
  ctx.font = '600 42px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    isFr ? 'Mes résultats' : 'My results',
    width / 2,
    isStory ? 230 : 160
  );

  // Quiz title
  ctx.font = '500 28px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.textMuted;
  const quizTitle = isFr ? quiz.title.fr : quiz.title.en;
  ctx.fillText(
    truncate(ctx, quizTitle, width - 120),
    width / 2,
    isStory ? 290 : 210
  );

  // Score ring
  const cx = width / 2;
  const cy = height * (isStory ? 0.42 : 0.48);
  const radius = isStory ? 180 : 150;

  ctx.strokeStyle = COLORS.ringTrack;
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (result.percentage / 100) * Math.PI * 2;
  ctx.strokeStyle = result.percentage >= 70 ? COLORS.success : COLORS.pink;
  ctx.lineWidth = 22;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.stroke();

  ctx.fillStyle = COLORS.text;
  ctx.font = '800 88px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${result.percentage}%`, cx, cy);

  // Score details
  ctx.textBaseline = 'alphabetic';
  ctx.font = '600 26px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.textMuted;
  ctx.fillText(
    isFr
      ? `${result.correctCount} / ${result.totalQuestions} bonnes réponses`
      : `${result.correctCount} / ${result.totalQuestions} correct answers`,
    cx,
    cy + radius + 56
  );

  // Stats
  const statsY = cy + radius + 110;
  ctx.font = '600 22px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.textMuted;
  ctx.fillText(`${result.timeTakenSeconds}s`, cx - 130, statsY);
  ctx.fillText(
    isFr
      ? `série ${result.maxStreak}`
      : `streak ${result.maxStreak}`,
    cx + 130,
    statsY
  );

  if (result.isNewHighScore) {
    ctx.font = '700 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = COLORS.pink;
    ctx.fillText(
      isFr ? '★ Nouveau record !' : '★ New high score!',
      cx,
      statsY + 48
    );
  }

  // Challenge hook
  ctx.font = '700 30px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.text;
  ctx.fillText(
    isFr ? 'Bats mon score →' : 'Beat my score →',
    cx,
    isStory ? height - 280 : height - 160
  );

  // Site URL
  ctx.font = '600 26px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.pink;
  ctx.fillText(displayHost(), cx, isStory ? height - 210 : height - 100);

  ctx.font = '500 18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.textSoft;
  ctx.fillText('pixfan.com', cx, isStory ? height - 160 : height - 60);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed'))),
      'image/png',
      1.0
    );
  });
}

export function downloadResultImage(
  blob: Blob,
  quizId: string,
  format: ExportImageFormat = 'square'
) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz-pixfan-${quizId}-${format}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function shareResultImage(
  blob: Blob,
  opts: {
    title: string;
    text: string;
    url?: string;
    fileName?: string;
  }
): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    const file = new File([blob], opts.fileName ?? 'quiz-result.png', {
      type: 'image/png',
    });
    const data: ShareData = {
      title: opts.title,
      text: opts.url ? `${opts.text} ${opts.url}` : opts.text,
      files: [file],
    };
    if (navigator.canShare && !navigator.canShare(data)) {
      // Retry without files if file share unsupported
      await navigator.share({
        title: opts.title,
        text: data.text,
        url: opts.url,
      });
      return true;
    }
    await navigator.share(data);
    return true;
  } catch {
    return false;
  }
}
