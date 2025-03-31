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
import { interactiveTasksApi } from '@/shared/api/interactive-tasks';
import type { InteractiveTask } from '@/shared/models/InteractiveTask';
import { FeedbackQuestions } from '@/shared/ui/FeedBackQuestions/FeedbackQuestions';
import { TaskDifficultyType } from '@/shared/models/types/TaskDifficultyType';

import Image from 'next/image';
import { getContentUrl } from '@/shared/utils/url';
import { AnswersField } from './AnswersField';

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  difficulty: z.number().min(1).max(10),
  cover_image: z.any(),
  answers: z
    .array(
      z.object({
        image: z.any(),
        answer: z.string(),
      })
    )
    .default([]),
  difficulty_type: z.nativeEnum(TaskDifficultyType),
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
        analytic_questions: z.array(z.string()).optional(),
      })
    )
    .default([]),
});

interface InteractiveTaskFormProps {
  initialData?: InteractiveTask;
}

export function InteractiveTaskForm({ initialData }: InteractiveTaskFormProps) {
  const router = useRouter();
  const { items: nozologies } = useNozologiesStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      difficulty: initialData?.difficulty || 1,
      difficulty_type:
        initialData?.difficulty_type || TaskDifficultyType['easy'],
      available_errors: initialData?.available_errors || 0,
      stars: initialData?.stars || 0,
      nozology: initialData?.nozology || '',
      answers: initialData?.answers || [],
      feedback: initialData?.feedback || [],
      cover_image: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      if (!initialData && !values.cover_image?.[0]) {
        throw new Error(
          'Обложка обязательна при создании интерактивной задачи'
        );
      }

      // Базовые поля
      formData.append('name', values.name);
      formData.append('difficulty', values.difficulty.toString());
      formData.append('difficulty_type', values.difficulty_type);
      formData.append('available_errors', values.available_errors.toString());
      formData.append('stars', values.stars.toString());
      formData.append('nozology', values.nozology);

      // Обработка обложки
      if (values.cover_image?.[0]) {
        formData.append('cover_image', values.cover_image[0]);
      }

      // Массивы и объекты
      formData.append('feedback', JSON.stringify(values.feedback));

      // Подготовка данных ответов
      const answersData = values.answers.map((ans, counter) => ({
        image:
          typeof ans.image === 'string' ? ans.image : `image_file_${counter}`,
        answer: ans.answer,
      }));
      formData.append('answers', JSON.stringify(answersData));

      // Отправка файлов изображений
      values.answers.forEach((answer, index) => {
        if (answer.image?.[0]) {
          formData.append(`image_file_${index}`, answer.image[0]);
        }
      });

      // Для отладки
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }

      if (initialData?._id) {
        await interactiveTasksApi.update(initialData._id.toString(), formData);
      } else {
        await interactiveTasksApi.create(formData);
      }

      router.push('/knowledge/interactive-tasks');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving interactive task:', error);
      alert(
        error.message || 'Произошла ошибка при сохранении интерактивной задачи'
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сложность (1-10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
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
            name="difficulty_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип сложности</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TaskDifficultyType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
          <AnswersField />
        </Card>

        <Card className="p-6">
          <FeedbackQuestions />
        </Card>

        <div className="flex gap-4">
          <Button type="submit">
            {initialData
              ? 'Сохранить изменения'
              : 'Создать интерактивную задачу'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}
