'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, BarChart, Search } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { useInsightQuestions } from '@/shared/hooks/use-insight-questions';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { BaseInsightQuestionDto } from '@/app/api/client/schemas';

// Тип для более безопасного обращения к полям вопроса
type AnalyticQuestion = {
  id: string;
  title: string;
  prompt: string;
};

export function FeedbackQuestions() {
  const { control, watch, setValue } = useFormContext();
  const {
    fields: questions,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'feedback',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const { questions: analyticQuestionsRaw } = useInsightQuestions(searchQuery);

  // Создаем безопасную версию вопросов с гарантированными полями
  const analyticQuestions: AnalyticQuestion[] = analyticQuestionsRaw.map(
    (q) => ({
      id: q.id || '',
      title: q.title || '',
      prompt: q.prompt || '',
    })
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const [selectedAnalyticQuestions, setSelectedAnalyticQuestions] = useState<
    string[]
  >([]);

  // Открытие диалога для выбора вопросов аналитики
  const openAnalyticsDialog = (questionIndex: number) => {
    const currentAnalyticQuestions =
      watch(`feedback.${questionIndex}.analytic_questions`) || [];
    setSelectedAnalyticQuestions(currentAnalyticQuestions);
    setSelectedQuestionIndex(questionIndex);
    setSearchQuery(''); // Сбрасываем поиск при каждом открытии
    setIsDialogOpen(true);
  };

  // Сохранение выбранных вопросов аналитики
  const saveAnalyticQuestions = () => {
    if (selectedQuestionIndex !== null) {
      setValue(
        `feedback.${selectedQuestionIndex}.analytic_questions`,
        selectedAnalyticQuestions
      );
      setIsDialogOpen(false);
    }
  };

  // Переключение выбора вопроса аналитики
  const toggleAnalyticQuestion = (id: string) => {
    setSelectedAnalyticQuestions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Вопросы для обратной связи</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            appendQuestion({
              question: '',
              has_correct: false,
              answers: [],
              analytic_questions: [],
            })
          }>
          <Plus className="h-4 w-4 mr-2" />
          Добавить вопрос
        </Button>
      </div>

      {questions.map((field, questionIndex) => {
        const hasCorrect = watch(`feedback.${questionIndex}.has_correct`);
        const questionAnalytics =
          watch(`feedback.${questionIndex}.analytic_questions`) || [];

        return (
          <Card key={field.id} className="p-4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">
                <FormField
                  control={control}
                  name={`feedback.${questionIndex}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Вопрос</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Введите вопрос" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`feedback.${questionIndex}.has_correct`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">
                        Есть правильный ответ
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {hasCorrect && (
                  <AnswersList
                    control={control}
                    questionIndex={questionIndex}
                  />
                )}

                {questionAnalytics.length > 0 && (
                  <div className="mt-2">
                    <FormLabel>Связанные вопросы аналитики:</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {questionAnalytics.map((id: string) => {
                        const question = analyticQuestions.find(
                          (q) => q.id === id
                        );
                        return (
                          <Badge key={id} variant="secondary">
                            {question
                              ? `${question.title.substring(0, 30)}...`
                              : id}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openAnalyticsDialog(questionIndex)}>
                  <BarChart className="h-4 w-4 mr-2" />
                  {questionAnalytics.length > 0
                    ? 'Изменить аналитику'
                    : 'Добавить аналитику'}
                </Button>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(questionIndex)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Выбор вопросов аналитики</DialogTitle>
          </DialogHeader>

          <div className="relative my-2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск вопросов..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {analyticQuestions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-start border rounded-md p-2 space-x-2">
                  <Checkbox
                    id={`analytic-${question.id}`}
                    checked={selectedAnalyticQuestions.includes(question.id)}
                    onCheckedChange={() => toggleAnalyticQuestion(question.id)}
                  />
                  <label
                    htmlFor={`analytic-${question.id}`}
                    className="text-sm leading-tight cursor-pointer">
                    <span className="font-bold">{question.title}</span> <br />{' '}
                    <br /> {question.prompt}
                  </label>
                </div>
              ))}

              {analyticQuestions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? 'Нет результатов по вашему запросу'
                    : 'Нет доступных вопросов аналитики'}
                </p>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={saveAnalyticQuestions}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AnswersList({
  control,
  questionIndex,
}: {
  control: any;
  questionIndex: number;
}) {
  const {
    fields: answers,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `feedback.${questionIndex}.answers`,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Варианты ответов</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ answer: '', is_correct: false })}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить вариант ответа
        </Button>
      </div>

      {answers.map((answer, answerIndex) => (
        <div key={answer.id} className="flex items-center gap-4">
          <FormField
            control={control}
            name={`feedback.${questionIndex}.answers.${answerIndex}.answer`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder="Введите вариант ответа" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`feedback.${questionIndex}.answers.${answerIndex}.is_correct`}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Правильный</FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(answerIndex)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
