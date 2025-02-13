'use client';

import { useEffect, useState } from 'react';

import { interactiveTasksApi } from '@/shared/api/interactive-tasks';
import type { InteractiveTask } from '@/shared/models/InteractiveTask';
import { InteractiveTaskForm } from '../../_components/InteractiveTaskForm';

export default function EditInteractiveTaskPage({
  params,
}: {
  params: { id: string };
}) {
  const [interactiveTask, setInteractiveTask] = useState<InteractiveTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInteractiveTask = async () => {
      try {
        const data = await interactiveTasksApi.getById(params.id);
        setInteractiveTask(data);
      } catch (error) {
        console.error('Error fetching interactive task:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInteractiveTask();
  }, [params.id]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!interactiveTask) {
    return <div>Интерактивная задача не найдена</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Редактирование интерактивной задачи</h1>
      <InteractiveTaskForm initialData={interactiveTask} />
    </div>
  );
} 