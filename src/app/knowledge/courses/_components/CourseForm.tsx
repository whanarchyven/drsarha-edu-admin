'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNozologiesStore } from '@/shared/store/nozologiesStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { brochuresApi } from '@/shared/api/brochures';
import type { Brochure } from '@/shared/models/Brochure';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { getContentUrl } from '@/shared/utils/url';
import Image from 'next/image';
import { coursesApi } from '@/shared/api/courses';
import type { Course } from '@/shared/models/Course';
import { KnowledgeBaseElementType } from '@/shared/models/types/KnowledgeBaseElementType';
import { StagesField } from './StagesField';
const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().min(1, 'Описание обязательно'),
  cover_image: z.any(),
  nozology: z.string().min(1, 'Выберите нозологию'),
  stars: z.number().min(1, 'Выберите оценку'),
  duration: z.string().min(1, 'Введите длительность'),
  stages: z.array(
    z.object({
      type: z.nativeEnum(KnowledgeBaseElementType),
      name: z.string().min(1, 'Введите название этапа'),
      knowledge_ref: z.string().min(1, 'Введите ID этапа'),
    })
  ),
});

interface CourseFormProps {
  initialData?: Course;
}

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const { items: nozologies } = useNozologiesStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      cover_image: '',
      nozology: '',
      stars: 0,
      duration: '',
      stages: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('nozology', values.nozology);
      formData.append('stars', values.stars.toString());
      formData.append('duration', values.duration);
      if (coverFile) {
        formData.append('cover_image', coverFile);
      }
      formData.append('stages', JSON.stringify(values.stages));

      if (initialData) {
        await coursesApi.update(initialData._id, formData);
      } else {
        await coursesApi.create(formData);
      }

      router.push('/knowledge/courses');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {initialData ? 'Редактирование курса' : 'Создание курса'}
        </CardTitle>
        <CardDescription>
          Заполните форму для {initialData ? 'обновления' : 'создания'} курса
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название курса..." {...field} />
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
                    <Input placeholder="Введите описание курса..." {...field} />
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

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Длительность</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите длительность курса..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Обложка</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file.name);
                            setCoverFile(file);
                            handleCoverImageChange(e);
                          }
                        }}
                        className="file:mr-4 h-fit file:py-2 file:px-4 file:rounded-lg file:border-0
                          file:text-sm file:font-medium file:bg-primary/10 file:text-primary
                          hover:file:bg-primary/20 cursor-pointer"
                      />
                      {coverPreview && (
                        <div className="relative w-full rounded-lg overflow-hidden">
                          <img
                            src={coverPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Загрузите изображение обложки
                  </FormDescription>
                  <FormMessage />
                  {initialData?.cover_image && (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={getContentUrl(initialData.cover_image)}
                        alt="Preview"
                        width={500}
                        height={300}
                        className="max-w-full h-auto"
                      />
                    </div>
                  )}
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
                  <FormDescription>
                    Выберите соответствующую нозологию для курса
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="p-4">
              <StagesField />
            </Card>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Загрузка...
                  </>
                ) : initialData ? (
                  'Сохранить'
                ) : (
                  'Создать'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}>
                Отмена
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
