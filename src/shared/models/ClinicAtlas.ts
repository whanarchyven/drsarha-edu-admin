import type { TaskDifficultyType } from './types/TaskDifficultyType.ts';
import type { FeedBackQuestions } from './types/FeedBackQuestions.ts';

export interface ClinicAtlas {
  _id?: string;
  name: string;
  difficulty: number;
  cover_image: string;
  images: {
    image: string;
    is_open: boolean;
  }[];
  description: string;
  clinical_picture: string;
  additional_info: string;
  difficulty_type: TaskDifficultyType;
  ai_scenario: string;
  stars: number;
  feedback: FeedBackQuestions;
  nozology: string;
}
