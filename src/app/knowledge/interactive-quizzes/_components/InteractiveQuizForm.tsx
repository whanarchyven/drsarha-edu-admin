'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useNozologiesStore } from '@/shared/store/nozologiesStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { interactiveQuizzesApi } from '@/shared/api/interactive-quizzes';
import type { InteractiveQuiz } from '@/shared/models/InteractiveQuiz';
import { FeedbackQuestions } from '@/shared/ui/FeedBackQuestions/FeedbackQuestions';

import Image from 'next/image';
import { getContentUrl } from '@/shared/utils/url';
import QuestionCreator from '@/components/question-creator';
import { useState } from 'react';
import type { Question } from '@/shared/models/types/QuestionType';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  correct_answer_comment: z.string().min(1, 'Комментарий к правильному ответу обязателен'),
  cover_image: z.any(),
  questions: z
    .array(
      z.object({
        image: z.any(),
        question: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.string(),
      })
    )
    .default([]),
  available_errors: z.number().min(0),
  stars: z.number().min(0).max(5),
  nozology: z.string().min(1, 'Нозология обязательна'),
  feedback: z
    .array(
      z.object({
        question: z.string(),
        has_correct: z.boolean(),
        answers: z
          .array(
            z.object({
              answer: z.string(),
              is_correct: z.boolean(),
            })
          )
          .optional(),
      })
    )
    .default([]),
});

interface InteractiveQuizFormProps {
  initialData?: InteractiveQuiz;
}

export function InteractiveQuizForm({ initialData }: InteractiveQuizFormProps) {
  const router = useRouter();
  const { items: nozologies } = useNozologiesStore();

  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      available_errors: initialData?.available_errors || 0,
      stars: initialData?.stars || 0,
      nozology: initialData?.nozology || '',
      questions: initialData?.questions || [],
      feedback: initialData?.feedback || [],
      cover_image: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values, 'VALUES');
      console.log(questions, 'QUESTIONS');

      if (!initialData && !values.cover_image?.[0]) {
        throw new Error(
          'Обложка обязательна при создании интерактивной викторины'
        );
      }

      const formData = new FormData();

      // Базовые поля
      formData.append('name', values.name);
      formData.append('available_errors', values.available_errors.toString());
      formData.append('stars', values.stars.toString());
      formData.append('nozology', values.nozology);

      // Обработка обложки
      if (values.cover_image?.[0] instanceof File) {
        formData.append('cover_image', values.cover_image[0]);
      }

      // Подготовка данных вопросов
      const questionsData = questions.map((question, index) => {
        const questionData: any = {
          question: question.question,
          type: question.type,
        };

        // Обработка изображения вопроса
        if (question.image) {
          if (typeof question.image === 'string') {
            if (question.image.includes('/images/')) {
              // Изображение уже на сервере
              questionData.image = question.image;
            } else if (question.image.startsWith('blob:')) {
              // Новое изображение
              questionData.image = `question_image_${index}`;
            } else {
              // Существующее изображение
              questionData.image = question.image;
            }
          }
        }

        // Обработка ответов
        if (question.type === 'variants' && question.answers) {
          questionData.answers = question.answers.map((answer, answerIndex) => {
            const answerData: any = {
              answer: answer.answer,
              isCorrect: answer.isCorrect,
            };

            // Обработка изображения ответа
            if (answer.image) {
              if (typeof answer.image === 'string') {
                if (answer.image.includes('/images/')) {
                  // Изображение уже на сервере
                  answerData.image = answer.image;
                } else if (answer.image.startsWith('blob:')) {
                  // Новое изображение
                  answerData.image = `question_${index}_answer_${answerIndex}_image`;
                } else {
                  // Существующее изображение
                  answerData.image = answer.image;
                }
              }
            }

            return answerData;
          });
        } else if (question.type === 'text') {
          questionData.answer = question.answer;
          if ('additional_info' in question && question.additional_info) {
            questionData.additional_info = question.additional_info;
          }
        }

        return questionData;
      });

      // Добавление данных вопросов в FormData
      formData.append('questions', JSON.stringify(questionsData));

      // Добавление данных обратной связи
      formData.append('feedback', JSON.stringify(values.feedback));

      // Загрузка файлов изображений для вопросов
      for (let qIndex = 0; qIndex < questions.length; qIndex++) {
        const question = questions[qIndex];

        // Загрузка изображения вопроса
        if (
          question.image &&
          typeof question.image === 'string' &&
          question.image.startsWith('blob:') &&
          !question.image.includes('/images/')
        ) {
          try {
            const response = await fetch(question.image);
            const blob = await response.blob();
            const file = new File([blob], `question_image_${qIndex}.jpg`, {
              type: 'image/jpeg',
            });
            formData.append(`question_image_${qIndex}`, file);
          } catch (error) {
            console.error(`Error processing question ${qIndex} image:`, error);
            throw new Error(
              `Ошибка при обработке изображения для вопроса ${qIndex + 1}`
            );
          }
        }

        // Загрузка изображений для ответов
        if (question.type === 'variants' && question.answers) {
          for (let aIndex = 0; aIndex < question.answers.length; aIndex++) {
            const answer = question.answers[aIndex];
            if (
              answer.image &&
              typeof answer.image === 'string' &&
              answer.image.startsWith('blob:') &&
              !answer.image.includes('/images/')
            ) {
              try {
                const response = await fetch(answer.image);
                const blob = await response.blob();
                const file = new File(
                  [blob],
                  `answer_image_${qIndex}_${aIndex}.jpg`,
                  { type: 'image/jpeg' }
                );
                formData.append(
                  `question_${qIndex}_answer_${aIndex}_image`,
                  file
                );
              } catch (error) {
                console.error(
                  `Error processing answer ${aIndex} image for question ${qIndex}:`,
                  error
                );
                throw new Error(
                  `Ошибка при обработке изображения для варианта ответа ${aIndex + 1} вопроса ${qIndex + 1}`
                );
              }
            }
          }
        }
      }

      // Для отладки выводим содержимое FormData
      console.log('FormData contents:');
      for (const pair of Array.from(formData.entries())) {
        console.log(pair[0], pair[1]);
      }

      if (initialData?._id) {
        await interactiveQuizzesApi.update(
          initialData._id.toString(),
          formData
        );
        toast.success('Интерактивная викторина успешно обновлена');
      } else {
        formData.entries().forEach(([key, value]) => {
          console.log(key, value, 'AUE');
        });
        await interactiveQuizzesApi.create(formData);
        toast.success('Интерактивная викторина успешно создана');
      }

      // router.push('/knowledge/interactive-quizzes');
      // router.refresh();
    } catch (error: any) {
      console.error('Error saving interactive quiz:', error);
      toast.error(
        error.message ||
          'Произошла ошибка при сохранении интерактивной викторины'
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Введите название" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="correct_answer_comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Комментарий к правильному ответу</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Введите комментарий" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="stars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Звезды (0-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available_errors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Доступные ошибки</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="nozology"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Нозология</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите нозологию" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {nozologies.map((nozology) => (
                      <SelectItem key={nozology._id} value={nozology._id}>
                        {nozology.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cover_image"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Обложка</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {initialData?.cover_image && (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={getContentUrl(initialData.cover_image)}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </FormItem>
            )}
          />
          <QuestionCreator questions={questions} setQuestions={setQuestions} />
        </Card>

        <Card className="p-6">
          <FeedbackQuestions />
        </Card>

        <div className="flex gap-4">
          <Button type="submit">
            {initialData
              ? 'Сохранить изменения'
              : 'Создать интерактивную викторину'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}
