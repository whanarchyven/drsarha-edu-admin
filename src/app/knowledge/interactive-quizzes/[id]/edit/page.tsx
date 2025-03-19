'use client';

import { useEffect, useState } from 'react';

import { interactiveQuizzesApi } from '@/shared/api/interactive-quizzes';
import type { InteractiveQuiz } from '@/shared/models/InteractiveQuiz';
import { InteractiveQuizForm } from '../../_components/InteractiveQuizForm';

export default function EditInteractiveQuizPage({
  params,
}: {
  params: { id: string };
}) {
  const [interactiveQuiz, setInteractiveQuiz] =
    useState<InteractiveQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInteractiveTask = async () => {
      try {
        const data = await interactiveQuizzesApi.getById(params.id);
        setInteractiveQuiz(data);
      } catch (error) {
        console.error('Error fetching interactive quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInteractiveTask();
  }, [params.id]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!interactiveQuiz) {
    return <div>Интерактивная викторина не найдена</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">
        Редактирование интерактивной викторины
      </h1>
      <InteractiveQuizForm initialData={interactiveQuiz} />
    </div>
  );
}
