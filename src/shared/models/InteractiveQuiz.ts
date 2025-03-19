
import type { FeedBackQuestions } from './types/FeedBackQuestions.ts';
import type { Question } from './types/QuestionType.ts';

export interface InteractiveQuiz {
    _id: string;
    name: string;
    cover_image: string;
    questions: Question[];
    available_errors: number;
    feedback: FeedBackQuestions;
    nozology: string;
    stars:number;
}
