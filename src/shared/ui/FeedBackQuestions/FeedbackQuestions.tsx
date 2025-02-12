'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";

export function FeedbackQuestions() {
  const { control, watch } = useFormContext();
  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: "feedback"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Вопросы для обратной связи</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendQuestion({ 
            question: '', 
            has_correct: false, 
            answers: [] 
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить вопрос
        </Button>
      </div>

      {questions.map((field, questionIndex) => {
        const hasCorrect = watch(`feedback.${questionIndex}.has_correct`);

        return (
          <Card key={field.id} className="p-4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">
                <FormField
                  control={control}
                  name={`feedback.${questionIndex}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Вопрос</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Введите вопрос" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`feedback.${questionIndex}.has_correct`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Есть правильный ответ</FormLabel>
                    </FormItem>
                  )}
                />

                {hasCorrect && (
                  <AnswersList 
                    control={control} 
                    questionIndex={questionIndex} 
                  />
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(questionIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function AnswersList({ control, questionIndex }: { control: any; questionIndex: number }) {
  const { fields: answers, append, remove } = useFieldArray({
    control,
    name: `feedback.${questionIndex}.answers`
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Варианты ответов</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ answer: '', is_correct: false })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить вариант ответа
        </Button>
      </div>

      {answers.map((answer, answerIndex) => (
        <div key={answer.id} className="flex items-center gap-4">
          <FormField
            control={control}
            name={`feedback.${questionIndex}.answers.${answerIndex}.answer`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder="Введите вариант ответа" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`feedback.${questionIndex}.answers.${answerIndex}.is_correct`}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Правильный</FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(answerIndex)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
} 