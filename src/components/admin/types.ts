import type { Quiz } from '../../types/quiz';

export interface AdminScreenProps {
  quizzes: Quiz[];
  onHome: () => void;
  /** Apply a session preview of edited data into the live quiz list. */
  onPreview: (quizzes: Quiz[]) => void;
}

export type AdminTab = 'questions' | 'reports' | 'analytics';
