'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { clinicTasksApi } from '@/shared/api/clinic-tasks';
import type { ClinicTask } from '@/shared/models/ClinicTask';
import { FeedbackQuestions } from '@/shared/ui/FeedBackQuestions/FeedbackQuestions';
import { TaskDifficultyType } from '@/shared/models/types/TaskDifficultyType';
import { ImagesField } from '@/shared/ui/ImagesField/ImagesField';
import { useState } from 'react';
import Image from 'next/image';
import { getContentUrl } from '@/shared/utils/url';
import { DiagnosesField } from './DiagnosesField';
import { Question } from '@/shared/models/types/QuestionType';
import QuestionCreator from '@/components/question-creator';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  difficulty: z.number().min(1).max(10),
  description: z.string().min(1, 'Описание обязательно'),
  cover_image: z.any(),
  images: z
    .array(
      z.object({
        image: z.any(),
        is_open: z.boolean(),
      })
    )
    .default([]),
  additional_info: z.string().optional(),
  ai_scenario: z.string().optional(),
  stars: z.number().min(0),
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

interface ClinicTaskFormProps {
  initialData?: ClinicTask;
}

export function ClinicTaskForm({ initialData }: ClinicTaskFormProps) {
  const router = useRouter();
  const { items: nozologies } = useNozologiesStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      difficulty: initialData?.difficulty || 1,
      description: initialData?.description || '',
      additional_info: initialData?.additional_info || '',
      ai_scenario: initialData?.ai_scenario || '',
      stars: initialData?.stars || 0,
      nozology: initialData?.nozology || '',
      feedback: initialData?.feedback || [],
      cover_image: undefined,
      images: initialData?.images || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values, 'VALUES');
    try {
      const formData = new FormData();

      if (!initialData && !values.cover_image?.[0]) {
        throw new Error('Обложка обязательна при создании задачи');
      }

      // Базовые поля
      formData.append('name', values.name);
      formData.append('difficulty', values.difficulty.toString());
      formData.append('description', values.description);
      formData.append('additional_info', values.additional_info || '');
      formData.append('ai_scenario', values.ai_scenario || '');
      formData.append('stars', values.stars.toString());
      formData.append('nozology', values.nozology);

      // Обработка обложки
      if (values.cover_image?.[0] instanceof File) {
        formData.append('cover_image', values.cover_image[0]);
      }

      // Массивы и объекты
      formData.append('feedback', JSON.stringify(values.feedback));

      // Добавляем массив вопросов
      formData.append('questions', JSON.stringify(questions));

      // Подготовка данных изображений
      const imagesData = values.images.map((img, counter) => ({
        image:
          typeof img.image === 'string' ? img.image : `image_file_${counter}`,
        is_open: img.is_open,
      }));
      formData.append('images', JSON.stringify(imagesData));

      // Отправка файлов изображений
      values.images.forEach((image, index) => {
        if (image.image?.[0] instanceof File) {
          formData.append(`image_file_${index}`, image.image[0]);
        }
      });

      const res = await clinicTasksApi.create(formData);
      console.log(res, 'RES');
      toast.success('Задача успешно создана');
      // router.push('/knowledge/clinic-tasks');
      // router.refresh();
    } catch (error: any) {
      console.error('Error saving clinic task:', error);
      alert(error.message || 'Произошла ошибка при сохранении задачи');
    }
  };

  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || []
  );

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
              name="stars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Звёзды</FormLabel>
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Введите описание" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additional_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дополнительная информация</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Дополнительная информация"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ai_scenario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI сценарий</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Опишите AI сценарий" />
                </FormControl>
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
          <QuestionCreator questions={questions} setQuestions={setQuestions} />
        </Card>

        <Card className="p-6">
          <ImagesField />
        </Card>

        <Card className="p-6">
          <FeedbackQuestions />
        </Card>

        <div className="flex gap-4">
          <Button type="submit">
            {initialData ? 'Сохранить изменения' : 'Создать клиническую задачу'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}
