export type QuestionType = 'variants' | 'text';

export type Question = {
    question: string;
    image?: string;
    type: QuestionType;
} & (
    {
        type: 'variants';
        answers: {
            image?: string;
            answer: string;
            isCorrect: boolean;
        }[];
    } | {
        type: 'text';
        answer: string;
        additional_info?: string;
    }
);