'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LectionForm } from '../../_components/LectionForm';
import { useNozologiesStore } from '@/shared/store/nozologiesStore';
import { lectionsApi } from '@/shared/api/lections';
import type { Lection } from '@/shared/models/Lection';

export default function EditLectionPage() {
  const { id } = useParams();
  const { fetchNozologies } = useNozologiesStore();
  const [lection, setLection] = useState<Lection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await lectionsApi.getById(id as string);
        setLection(data);
      } catch (error) {
        console.error('Error fetching lection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNozologies();
    fetchData();
  }, [id, fetchNozologies]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!lection) {
    return <div>Лекция не найдена</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Редактирование лекции</h1>
      <LectionForm initialData={lection} />
    </div>
  );
}
