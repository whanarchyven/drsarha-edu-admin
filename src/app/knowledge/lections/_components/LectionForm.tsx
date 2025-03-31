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
import { lectionsApi } from '@/shared/api/lections';
import type { Lection } from '@/shared/models/Lection';
import { FeedbackQuestions } from '@/shared/ui/FeedBackQuestions/FeedbackQuestions';
import { getContentUrl } from '@/shared/utils/url';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().min(1, 'Описание обязательно'),
  duration: z.string().min(1, 'Длительность обязательна'),
  stars: z.number().min(0).default(0),
  nozology: z.string().min(1, 'Нозология обязательна'),
  cover_image: z.any(),
  video: z.any(),
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

interface LectionFormProps {
  initialData?: Lection;
}

export function LectionForm({ initialData }: LectionFormProps) {
  const router = useRouter();
  const { items: nozologies } = useNozologiesStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      duration: initialData?.duration || '',
      stars: initialData?.stars || 0,
      nozology: initialData?.nozology || '',
      feedback: initialData?.feedback || [],
      cover_image: undefined,
      video: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      // Проверяем наличие обязательных файлов при создании
      if (!initialData && (!values.cover_image?.[0] || !values.video?.[0])) {
        throw new Error('Обложка и видео обязательны при создании лекции');
      }

      // Базовые поля как строки
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('duration', values.duration);
      formData.append('stars', values.stars.toString()); // Преобразуем в строку
      formData.append('nozology', values.nozology);

      // Файлы
      if (values.cover_image?.[0]) {
        formData.append('cover_image', values.cover_image[0]);
      }
      if (values.video?.[0]) {
        formData.append('video', values.video[0]);
      }

      // Feedback как JSON строка
      formData.append('feedback', JSON.stringify(values.feedback));

      if (initialData?._id) {
        await lectionsApi.update(initialData._id, formData);
      } else {
        await lectionsApi.create(formData);
      }

      router.push('/knowledge/lections');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving lection:', error);
      alert(error.message || 'Произошла ошибка при сохранении лекции');
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
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Длительность</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Введите длительность" />
                </FormControl>
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

          <FormField
            control={form.control}
            name="video"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Видео</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
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
            name="stars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Звезды</FormLabel>
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
        </Card>

        <Card className="p-6">
          <FeedbackQuestions />
        </Card>

        <div className="flex gap-4">
          <Button type="submit">
            {initialData ? 'Сохранить изменения' : 'Создать лекцию'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}
