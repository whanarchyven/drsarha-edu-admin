'use client';

import { useEffect } from 'react';

import { useNozologiesStore } from '@/shared/store/nozologiesStore';
import { InteractiveTaskForm } from '../_components/InteractiveTaskForm';

export default function CreateClinicTaskPage() {
  const { fetchNozologies } = useNozologiesStore();

  useEffect(() => {
    fetchNozologies();
  }, [fetchNozologies]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Создание интерактивной задачи</h1>
      <InteractiveTaskForm />
    </div>
  );
}
