'use client';

import { useEffect } from 'react';

import { useNozologiesStore } from '@/shared/store/nozologiesStore';
import { ClinicAtlasForm } from '../_components/ClinicAtlasForm';

export default function CreateClinicTaskPage() {
  const { fetchNozologies } = useNozologiesStore();

  useEffect(() => {
    fetchNozologies();
  }, [fetchNozologies]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Создание клинического атласа</h1>
      <ClinicAtlasForm />
    </div>
  );
}
