'use client';

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { getContentUrl } from "@/shared/utils/url";

export function AnswersField() {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "answers",
    control: form.control,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Ответы</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ image: undefined, answer: '' })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить ответ
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name={`answers.${index}.image`}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Изображение</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files?.length) {
                            onChange(files);
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {typeof value === 'string' && (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={getContentUrl(value)}
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
                name={`answers.${index}.answer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ответ</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Введите ответ" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 