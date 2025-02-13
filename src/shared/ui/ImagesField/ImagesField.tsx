'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { getContentUrl } from '@/shared/utils/url';

export function ImagesField() {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: 'images',
    control: form.control,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Изображения</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ image: undefined, is_open: true })}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить изображение
        </Button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-4 p-4 border rounded-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name={`images.${index}.image`}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Изображение</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {typeof field.image === 'string' && (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={getContentUrl(field.image)}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name={`images.${index}.is_open`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Открыто изначально
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => remove(index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
