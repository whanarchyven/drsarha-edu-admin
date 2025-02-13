import type { FeedBackQuestions } from './types/FeedBackQuestions.ts';

export interface Lection {
  _id?: string;
  name: string;
  cover_image: string;
  description: string;
  duration: string;
  video: string;
  stars: number;
  feedback: FeedBackQuestions;
  nozology: string;
}
