'use client';

import { useEffect, useState } from 'react';
import { BrochureForm } from '../../_components/BrochureForm';
import { brochuresApi } from '@/shared/api/brochures';
import type { Brochure } from '@/shared/models/Brochure';

export default function EditBrochurePage({
  params,
}: {
  params: { id: string };
}) {
  const [brochure, setBrochure] = useState<Brochure | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrochure = async () => {
      try {
        const data = await brochuresApi.getById(params.id);
        setBrochure(data);
      } catch (error) {
        console.error('Error fetching brochure:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrochure();
  }, [params.id]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!brochure) {
    return <div>Брошюра не найдена</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Редактирование брошюры</h1>
      <BrochureForm initialData={brochure} />
    </div>
  );
}
