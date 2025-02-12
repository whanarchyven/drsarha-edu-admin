'use client';

import { useEffect } from 'react';
import { LectionForm } from '../_components/LectionForm';
import { useNozologiesStore } from '@/shared/store/nozologiesStore';

export default function CreateLectionPage() {
  const { fetchNozologies } = useNozologiesStore();

  useEffect(() => {
    fetchNozologies();
  }, [fetchNozologies]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Создание лекции</h1>
      <LectionForm />
    </div>
  );
} 