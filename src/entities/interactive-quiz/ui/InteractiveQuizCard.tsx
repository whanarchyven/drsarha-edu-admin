'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Star, Edit, Trash2, Eye, AlertCircle, BarChart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { InteractiveQuiz } from '@/shared/models/InteractiveQuiz';
import { getContentUrl } from '@/shared/utils/url';
import { TaskBadges } from '@/shared/ui/TaskBadges/TaskBadges';
import { copyToClipboardWithToast } from '@/shared/utils/copyToClipboard';
import { interactiveQuizzesApi } from '@/shared/api/interactive-quizzes';
interface InteractiveQuizCardProps extends InteractiveQuiz {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function InteractiveQuizCard({
  _id,
  name,
  cover_image,
  questions,
  available_errors,
  feedback,
  nozology,
  correct_answer_comment,
  stars,
  onEdit,
  onDelete,
}: InteractiveQuizCardProps) {
  const [imagesOpen, setImagesOpen] = useState(false);
  const [statsPopOpen, setStatsPopOpen] = useState(false);
  const [statistics, setStatistics] = useState<{
    views: number;
    completed: number;
    correct_answers: number;
    incorrect_answers: number;
  }>({ views: 0, completed: 0, correct_answers: 0, incorrect_answers: 0 });

  useEffect(() => {
    const fetchStatistics = async () => {
      const stats = await interactiveQuizzesApi.getStatistics(_id as string);
      setStatistics(stats);
    };
    fetchStatistics();
  }, [_id]);
  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/9]">
          <Image
            src={getContentUrl(cover_image)}
            alt={name}
            fill
            className="object-cover"
          />
          <Button
            variant="outline"
            className="absolute top-2 right-2"
            onClick={async () => await copyToClipboardWithToast(_id as string)}>
            {_id}
          </Button>
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold leading-none tracking-tight">
                {name}
              </h3>
            </div>
            <div className="flex -ml-1 text-yellow-400">
              <Star className={`w-4 h-4 fill-current`} />
              <p className="text-sm text-black">{stars}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <strong>Доступно ошибок:</strong> {available_errors}
          </div>

          <div className="text-sm">
            <strong>Комментарий к правильному ответу:</strong>{' '}
            {correct_answer_comment}
          </div>

          <div className="flex flex-col gap-2">
            {questions.map((question, index) => (
              <div
                className="grid grid-cols-2 gap-2 border-2 border-gray-300 rounded-md p-2"
                key={index}>
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Вопрос {index + 1}</p>
                  <p>{question.question}</p>
                  <div className="flex flex-col gap-2">
                    <p className="text-md font-bold">
                      Комментарий к правильному ответу
                    </p>
                    <p className="text-sm text-gray-500">
                      {question.correct_answer_comment}
                    </p>
                  </div>
                  {question.image && (
                    <Image
                      src={getContentUrl(question.image)}
                      alt={question.question}
                      width={300}
                      height={300}
                    />
                  )}
                </div>
                <div className="flex p-3 flex-col gap-2">
                  <p className="text-md font-bold">Ответы</p>
                  {question.type === 'variants' &&
                    question.answers?.map((answer, answerIndex) => (
                      <div
                        className="flex flex-col gap-2 border-2 border-gray-300 rounded-md p-2"
                        key={answerIndex}>
                        <p>
                          {answerIndex + 1}. {answer.answer} -{' '}
                          <span
                            className={`${answer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            {answer.isCorrect ? 'Правильный' : 'Неправильный'}
                          </span>
                        </p>
                        {answer.image && (
                          <Image
                            src={getContentUrl(answer.image)}
                            alt={answer.answer}
                            width={100}
                            height={100}
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <TaskBadges feedback={feedback} />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete?.(_id as string)}>
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Удалить</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStatsPopOpen(true)}>
            <BarChart className="w-4 h-4" />
            <span className="sr-only">Статистика</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={statsPopOpen} onOpenChange={setStatsPopOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Статистика</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Просмотров: {statistics.views}</p>
            <p>Выполнено: {statistics.completed}</p>
            <p>Правильных ответов: {statistics.correct_answers}</p>
            <p>Неправильных ответов: {statistics.incorrect_answers}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
