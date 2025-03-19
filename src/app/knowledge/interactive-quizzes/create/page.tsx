'use client';

import { useEffect } from 'react';

import { useNozologiesStore } from '@/shared/store/nozologiesStore';
import { InteractiveQuizForm } from '../_components/InteractiveQuizForm';

export default function CreateInteractiveQuizPage() {
  const { fetchNozologies } = useNozologiesStore();

  useEffect(() => {
    fetchNozologies();
  }, [fetchNozologies]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Создание интерактивной викторины</h1>
      <InteractiveQuizForm />
    </div>
  );
}
