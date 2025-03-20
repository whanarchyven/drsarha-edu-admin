'use client';

import type React from 'react';

import { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type {
  Question,
  QuestionType,
} from '@/shared/models/types/QuestionType';
import { getContentUrl } from '@/shared/utils/url';

export default function QuestionCreator({
  questions,
  setQuestions,
}: {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
}) {
  const addQuestion = () => {
    const newQuestion: Question = {
      question: '',
      type: 'variants',
      answers: [{ answer: '', isCorrect: false }],
      correct_answer_comment: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };

    // If changing type, initialize the appropriate structure
    if (field === 'type') {
      if (value === 'variants') {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          type: 'variants',
          answers: [{ answer: '', isCorrect: false }],
          correct_answer_comment:
            updatedQuestions[index].correct_answer_comment || '',
        };
      } else if (value === 'text') {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          type: 'text',
          answer: '',
          additional_info: '',
          correct_answer_comment:
            updatedQuestions[index].correct_answer_comment || '',
        };
      }
    }

    setQuestions(updatedQuestions);
  };

  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].type === 'variants') {
      updatedQuestions[questionIndex].answers.push({
        answer: '',
        isCorrect: false,
      });
      setQuestions(updatedQuestions);
    }
  };

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    field: string,
    value: any
  ) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].type === 'variants') {
      updatedQuestions[questionIndex].answers[answerIndex] = {
        ...updatedQuestions[questionIndex].answers[answerIndex],
        [field]: value,
      };
      setQuestions(updatedQuestions);
    }
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].type === 'variants') {
      updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleImageUpload = (
    questionIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // and get back a URL to store in the question object
      console.log(`Uploading image for question ${questionIndex}:`, file.name);

      // For demonstration, we'll just update the question with a placeholder
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        image: URL.createObjectURL(file),
      };
      setQuestions(updatedQuestions);
    }
  };

  const handleAnswerImageUpload = (
    questionIndex: number,
    answerIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && questions[questionIndex].type === 'variants') {
      // In a real application, you would upload the file to a server
      console.log(
        `Uploading image for question ${questionIndex}, answer ${answerIndex}:`,
        file.name
      );

      // For demonstration, we'll just update the answer with a placeholder
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].answers[answerIndex] = {
        ...updatedQuestions[questionIndex].answers[answerIndex],
        image: URL.createObjectURL(file),
      };
      setQuestions(updatedQuestions);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Вопросы</h2>
        <Button type="button" onClick={addQuestion}>
          <Plus className="mr-2 h-4 w-4" /> Добавить
        </Button>
      </div>

      {questions.map((question, questionIndex) => (
        <Card key={questionIndex} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Вопрос {questionIndex + 1}</CardTitle>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeQuestion(questionIndex)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${questionIndex}`}>Текст вопроса</Label>
              <Textarea
                id={`question-${questionIndex}`}
                value={question.question}
                onChange={(e) =>
                  updateQuestion(questionIndex, 'question', e.target.value)
                }
                placeholder="Введите текст вопроса"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`correct-answer-comment-${questionIndex}`}>
                Комментарий к правильному ответу
              </Label>
              <Textarea
                id={`correct-answer-comment-${questionIndex}`}
                value={question.correct_answer_comment}
                onChange={(e) =>
                  updateQuestion(
                    questionIndex,
                    'correct_answer_comment',
                    e.target.value
                  )
                }
                placeholder="Введите комментарий к правильному ответу"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`question-type-${questionIndex}`}>
                  Тип вопроса
                </Label>
                <Select
                  value={question.type}
                  onValueChange={(value: QuestionType) =>
                    updateQuestion(questionIndex, 'type', value)
                  }>
                  <SelectTrigger id={`question-type-${questionIndex}`}>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="variants">
                      С вариантами ответов
                    </SelectItem>
                    <SelectItem value="text">Текстовый ответ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`question-image-${questionIndex}`}>
                  Изображение
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`question-image-${questionIndex}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(questionIndex, e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document
                        .getElementById(`question-image-${questionIndex}`)
                        ?.click()
                    }
                    className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Загрузить
                  </Button>
                  {question.image && (
                    <div className="relative h-10 w-10 rounded overflow-hidden">
                      <img
                        src={
                          question.image.includes('/images/')
                            ? getContentUrl(question.image)
                            : question.image || '/placeholder.svg'
                        }
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {question.type === 'variants' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Варианты ответов</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAnswer(questionIndex)}>
                    <Plus className="mr-2 h-4 w-4" /> Добавить ответ
                  </Button>
                </div>

                {question.answers.map((answer, answerIndex) => (
                  <Card key={answerIndex} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`answer-${questionIndex}-${answerIndex}`}>
                          Ответ
                        </Label>
                        <Textarea
                          id={`answer-${questionIndex}-${answerIndex}`}
                          value={answer.answer}
                          onChange={(e) =>
                            updateAnswer(
                              questionIndex,
                              answerIndex,
                              'answer',
                              e.target.value
                            )
                          }
                          placeholder="Введите вариант ответа"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor={`answer-image-${questionIndex}-${answerIndex}`}>
                          Изображение
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`answer-image-${questionIndex}-${answerIndex}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleAnswerImageUpload(
                                questionIndex,
                                answerIndex,
                                e
                              )
                            }
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById(
                                  `answer-image-${questionIndex}-${answerIndex}`
                                )
                                ?.click()
                            }
                            className="w-full">
                            <Upload className="mr-2 h-4 w-4" /> Загрузить
                          </Button>
                          {answer.image && (
                            <div className="relative h-10 w-10 rounded overflow-hidden">
                              <img
                                src={
                                  answer.image.includes('/images/')
                                    ? getContentUrl(answer.image)
                                    : answer.image || '/placeholder.svg'
                                }
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`correct-${questionIndex}-${answerIndex}`}
                          checked={answer.isCorrect}
                          onCheckedChange={(checked) =>
                            updateAnswer(
                              questionIndex,
                              answerIndex,
                              'isCorrect',
                              checked
                            )
                          }
                        />
                        <Label
                          htmlFor={`correct-${questionIndex}-${answerIndex}`}>
                          Правильный ответ
                        </Label>
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeAnswer(questionIndex, answerIndex)}
                        disabled={question.answers.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`text-answer-${questionIndex}`}>Ответ</Label>
                  <Textarea
                    id={`text-answer-${questionIndex}`}
                    value={(question as any).answer || ''}
                    onChange={(e) =>
                      updateQuestion(questionIndex, 'answer', e.target.value)
                    }
                    placeholder="Введите правильный ответ"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`additional-info-${questionIndex}`}>
                    Дополнительная информация
                  </Label>
                  <Textarea
                    id={`additional-info-${questionIndex}`}
                    value={(question as any).additional_info || ''}
                    onChange={(e) =>
                      updateQuestion(
                        questionIndex,
                        'additional_info',
                        e.target.value
                      )
                    }
                    placeholder="Введите дополнительную информацию (необязательно)"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {questions.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">
            Нет добавленных вопросов. Нажмите Добавить чтобы создать вопрос.
          </p>
        </div>
      )}
    </div>
  );
}
