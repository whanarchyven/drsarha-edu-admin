'use client';

import { useEffect, useState } from 'react';
import { ClinicTaskForm } from '../../_components/ClinicTaskForm';
import { clinicTasksApi } from '@/shared/api/clinic-tasks';
import type { ClinicTask } from '@/shared/models/ClinicTask';

export default function EditClinicTaskPage({
  params,
}: {
  params: { id: string };
}) {
  const [clinicTask, setClinicTask] = useState<ClinicTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClinicTask = async () => {
      try {
        const data = await clinicTasksApi.getById(params.id);
        setClinicTask(data);
      } catch (error) {
        console.error('Error fetching clinic task:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClinicTask();
  }, [params.id]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!clinicTask) {
    return <div>Клиническая задача не найдена</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">
        Редактирование клинической задачи
      </h1>
      <ClinicTaskForm initialData={clinicTask} />
    </div>
  );
}
