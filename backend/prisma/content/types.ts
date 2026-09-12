/**
 * Shared content types for the Task 5 new-course curriculum files.
 *
 * Matches the existing content architecture (see content/sql.ts): a course is a
 * list of sections (modules), each with topics (lesson text + code + note) and a
 * module-level chapter quiz. Per-topic quizzes live in a Record keyed by the
 * EXACT topic title (topic-lock flow requirement).
 */

export interface Topic {
  title: string;
  text: string;
  code?: string | null;
  note: string;
}

export interface Quiz {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Section {
  week: number;
  title: string;
  description: string;
  topics: Topic[];
  quizzes: Quiz[];
}

export type TopicQuizMap = Record<string, Quiz[]>;
