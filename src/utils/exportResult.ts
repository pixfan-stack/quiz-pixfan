/**
 * Utility: Export quiz results as a shareable image.
 * Uses Canvas API to create a styled image with score, quiz info, and branding.
 */

import type { Quiz, QuizResult } from '../types/quiz';

const COLORS = {
  bg: '#4f46e5',
  bgGradientEnd: '#7c3aed',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.75)',
  accent: '#22d3ee',
  success: '#10b981',
  danger: '#f43f5e',
  cardBg: 'rgba(255,255,255,0.15)',
};

export async function exportResultAsImage(
  result: QuizResult,
  quiz: Quiz,
  lang: 'en' | 'fr' = 'en'
): Promise<Blob> {
  const width = 1080;
  const height = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, COLORS.bg);
  grad.addColorStop(1, COLORS.bgGradientEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative circles
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.8, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Title
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 36px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(lang === 'fr' ? 'Mes Résultats' : 'My Results', width / 2, 100);

  // Quiz title
  ctx.font = '600 28px Inter, system-ui, sans-serif';
  ctx.fillStyle = COLORS.textMuted;
  const quizTitle = lang === 'fr' ? quiz.title.fr : quiz.title.en;
  ctx.fillText(quizTitle, width / 2, 150);

  // Score ring
  const cx = width / 2;
  const cy = height / 2 - 20;
  const radius = 140;

  ctx.strokeStyle = COLORS.cardBg;
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (result.percentage / 100) * Math.PI * 2;
  ctx.strokeStyle = result.percentage >= 70 ? COLORS.success : COLORS.accent;
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.stroke();

  // Percentage text
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 72px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${result.percentage}%`, cx, cy);

  // Score details
  ctx.textBaseline = 'alphabetic';
  ctx.font = '600 24px Inter, system-ui, sans-serif';
  ctx.fillStyle = COLORS.textMuted;
  ctx.fillText(
    lang === 'fr'
      ? `${result.correctCount} / ${result.totalQuestions} bonnes réponses`
      : `${result.correctCount} / ${result.totalQuestions} correct answers`,
    cx, cy + radius + 60
  );

  // Stats row
  const statsY = cy + radius + 120;
  ctx.font = '600 20px Inter, system-ui, sans-serif';
  ctx.fillStyle = COLORS.textMuted;
  ctx.fillText(`⏱ ${result.timeTakenSeconds}s`, cx - 120, statsY);
  ctx.fillText(`🔥 ${result.maxStreak} streak`, cx + 120, statsY);

  // New high score badge
  if (result.isNewHighScore) {
    const badgeY = statsY + 50;
    ctx.font = 'bold 22px Inter, system-ui, sans-serif';
    ctx.fillStyle = COLORS.accent;
    ctx.fillText(
      lang === 'fr' ? '★ Nouveau record !' : '★ New high score!',
      cx, badgeY
    );
  }

  // Footer
  ctx.font = '500 18px Inter, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('Quiz PixFan', cx, height - 60);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Failed')),
      'image/png', 1.0
    );
  });
}

export function downloadResultImage(blob: Blob, quizId: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz-pixfan-${quizId}-result.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function shareResultImage(
  blob: Blob,
  quizTitle: string,
  lang: 'en' | 'fr'
): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    const file = new File([blob], 'quiz-result.png', { type: 'image/png' });
    await navigator.share({
      title: lang === 'fr' ? 'Quiz PixFan - Mes Résultats' : 'Quiz PixFan - My Results',
      text: quizTitle,
      files: [file],
    });
    return true;
  } catch {
    return false;
  }
}
