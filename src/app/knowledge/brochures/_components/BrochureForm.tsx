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

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  pdf_file: z.any(),
  cover_image: z.any(),
  nozology: z.string().min(1, 'Выберите нозологию'),
});

interface BrochureFormProps {
  initialData?: Brochure;
}

export function BrochureForm({ initialData }: BrochureFormProps) {
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
      pdf_file: '',
      cover_image: '',
      nozology: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('nozology', values.nozology);

      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      }

      if (coverFile) {
        formData.append('cover_image', coverFile);
      }

      if (initialData) {
        await brochuresApi.update(initialData._id, formData);
      } else {
        await brochuresApi.create(formData);
      }

      router.push('/knowledge/brochures');
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
          {initialData ? 'Редактирование брошюры' : 'Создание брошюры'}
        </CardTitle>
        <CardDescription>
          Заполните форму для {initialData ? 'обновления' : 'создания'} брошюры
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
                    <Input
                      placeholder="Введите название брошюры..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pdf_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PDF файл</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file.name);
                            setPdfFile(file);
                          }
                        }}
                        className="file:mr-4 h-fit file:py-2 file:px-4 file:rounded-lg file:border-0
                          file:text-sm file:font-medium file:bg-primary/10 file:text-primary
                          hover:file:bg-primary/20 cursor-pointer"
                      />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormDescription>Загрузите PDF файл брошюры</FormDescription>
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
                    Выберите соответствующую нозологию для брошюры
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
