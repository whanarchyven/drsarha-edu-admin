'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { nozologiesApi } from '@/shared/api/nozologies';

const formSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
});

interface NozologyFormProps {
  initialData?: {
    _id: string;
    name: string;
  };
}

export function NozologyForm({ initialData }: NozologyFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted with values:', values);
    try {
      if (initialData) {
        console.log('Updating existing nozology...');
        await nozologiesApi.update(initialData._id, values);
      } else {
        console.log('Creating new nozology...');
        await nozologiesApi.create(values);
      }
      console.log('API call successful');
      router.push('/knowledge/');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Введите название..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit">
            {initialData ? 'Сохранить' : 'Создать'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
} 