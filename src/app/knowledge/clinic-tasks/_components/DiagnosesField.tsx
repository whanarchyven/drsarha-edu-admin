'use client';

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export function DiagnosesField() {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "diagnoses",
    control: form.control,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Диагнозы</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '', is_correct: false, description: '' })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить диагноз
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name={`diagnoses.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название диагноза</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Введите название диагноза" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`diagnoses.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Введите описание диагноза" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`diagnoses.${index}.is_correct`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Правильный диагноз
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