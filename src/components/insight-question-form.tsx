'use client';

import type React from 'react';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Типы данных
type ResponseType = 'int' | 'variants_multiple';

interface CreateInsightQuestionDto {
  title: string;
  prompt: string;
  response_type: ResponseType;
  response_variants: string[];
  llm_model: string;
  llm_temperature: number;
}

type InsightQuestionFormData = CreateInsightQuestionDto;

interface InsightQuestionFormProps {
  onSubmit: (data: InsightQuestionFormData) => Promise<void>;
  onCancel: () => void;
}

export function InsightQuestionForm({
  onSubmit,
  onCancel,
}: InsightQuestionFormProps) {
  const [formData, setFormData] = useState<InsightQuestionFormData>({
    title: '',
    prompt: '',
    response_type: 'int',
    response_variants: [],
    llm_model: 'gpt-4o',
    llm_temperature: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      response_variants: [...(prev.response_variants || []), ''],
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      response_variants: prev.response_variants.map((opt, i) =>
        i === index ? value : opt
      ),
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      response_variants: prev.response_variants.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Название</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt">Текст вопроса</Label>
          <Textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) =>
              setFormData({ ...formData, prompt: e.target.value })
            }
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="response-type">Тип ответа</Label>
          <Select
            value={formData.response_type}
            onValueChange={(value: ResponseType) =>
              setFormData({
                ...formData,
                response_type: value,
                response_variants:
                  value === 'variants_multiple'
                    ? formData.response_variants
                    : [],
              })
            }>
            <SelectTrigger id="response-type">
              <SelectValue placeholder="Выберите тип ответа" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="int">Целое число</SelectItem>
              <SelectItem value="variants_multiple">
                Несколько из списка
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.response_type === 'variants_multiple' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Варианты ответов</Label>
              <Button
                type="button"
                onClick={handleAddOption}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Добавить вариант
              </Button>
            </div>

            {formData.response_variants.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Нет вариантов ответа. Добавьте хотя бы один вариант.
              </p>
            )}

            {formData.response_variants.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Вариант ${index + 1}`}
                  className="flex-1"
                  required
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Удалить вариант</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" onClick={onCancel} variant="outline">
            Отмена
          </Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </div>
  );
}
