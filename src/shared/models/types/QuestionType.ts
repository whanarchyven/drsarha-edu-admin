export type QuestionType = 'variants' | 'text';

export type Question = {
  question: string;
  image?: string;
  type: QuestionType;
  correct_answer_comment: string;
} & (
  | {
      type: 'variants';
      answers: {
        image?: string;
        answer: string;
        isCorrect: boolean;
        correct_answer_comment?: string;
      }[];
    }
  | {
      type: 'text';
      answer: string;
      additional_info?: string;
    }
);
