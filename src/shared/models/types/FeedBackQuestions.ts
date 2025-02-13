type FeedBackQuestion = {
  question: string;
  has_correct: boolean;
  answers?: {
    answer: string;
    is_correct: boolean;
  }[];
};

export type FeedBackQuestions = FeedBackQuestion[];
