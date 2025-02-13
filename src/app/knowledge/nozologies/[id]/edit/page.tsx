'use client';

import { useEffect, useState } from 'react';
import { NozologyForm } from '../../_components/NozologyForm';
import { nozologiesApi } from '@/shared/api/nozologies';
import type { Nozology } from '@/shared/models/Nozology';

export default function EditNozologyPage({
  params,
}: {
  params: { id: string };
}) {
  const [nozology, setNozology] = useState<Nozology | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNozology = async () => {
      try {
        const data = await nozologiesApi.getById(params.id);
        setNozology(data);
      } catch (error) {
        console.error('Error fetching nozology:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNozology();
  }, [params.id]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!nozology) {
    return <div>Нозология не найдена</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Редактирование нозологии</h1>
      <NozologyForm initialData={nozology} />
    </div>
  );
}
