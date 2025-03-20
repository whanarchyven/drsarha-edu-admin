import type { TaskDifficultyType } from './types/TaskDifficultyType.ts';
import type { FeedBackQuestions } from './types/FeedBackQuestions.ts';
import { Question } from './types/QuestionType.js';

export interface ClinicTask {
  _id?: string;
  name: string;
  difficulty: number;
  cover_image: string;
  images: {
    image: string;
    is_open: boolean;
  }[];
  description: string;
  questions: Question[];
  additional_info: string;
  ai_scenario: string;
  stars: number;
  feedback: FeedBackQuestions;
  nozology: string;
}
