'use client';

import { useEffect } from 'react';

import { useNozologiesStore } from '@/shared/store/nozologiesStore';
import { ClinicTaskForm } from '../_components/ClinicTaskForm';

export default function CreateClinicTaskPage() {
  const { fetchNozologies } = useNozologiesStore();

  useEffect(() => {
    fetchNozologies();
  }, [fetchNozologies]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Создание клинической задачи</h1>
      <ClinicTaskForm />
    </div>
  );
}
