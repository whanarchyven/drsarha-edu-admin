'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CheckSquare, ClipboardList } from 'lucide-react';
import type { FeedBackQuestions } from '@/shared/models/types/FeedBackQuestions';

interface TaskBadgesProps {
  feedback: FeedBackQuestions;
}

export function TaskBadges({ feedback }: TaskBadgesProps) {
  const questionCount = feedback.length;
  const hasTest = feedback.some((q) => q.has_correct);

  return (
    <div className="flex items-center gap-2">
      {hasTest ? (
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckSquare className="w-3 h-3" />
          Тест
        </Badge>
      ) : null}

      <TooltipProvider>
        <Tooltip delayDuration={0.2}>
          <TooltipTrigger asChild>
            <div>
              <Badge
                variant="outline"
                className="flex items-center cursor-pointer gap-1">
                <ClipboardList className="w-3 h-3" />
                {questionCount} вопрос(ов)
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] bg-white text-black shadow-lg border-slate-200 border-2">
            <div className="space-y-2">
              {feedback.map((q, i) => {
                if (q.answers) {
                  return (
                    <div key={i}>
                      <div className="font-medium">{q.question}</div>
                      {q.answers.length > 0 && (
                        <div className="pl-2 mt-1 text-sm">
                          {q.answers.map((a, j) => (
                            <div key={j} className="flex items-center gap-1">
                              {q.has_correct && (
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    a.is_correct ? 'bg-green-500' : 'bg-red-500'
                                  }`}
                                />
                              )}
                              {a.answer}
                            </div>
                          ))}
                        </div>
                      )}
                      {i < feedback.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
