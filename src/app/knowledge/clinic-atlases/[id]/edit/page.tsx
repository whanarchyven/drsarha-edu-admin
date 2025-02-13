'use client';

import { useEffect, useState } from 'react';
import { ClinicAtlasForm } from '../../_components/ClinicAtlasForm';
import { clinicAtlasesApi } from '@/shared/api/clinic-atlases';
import type { ClinicAtlas } from '@/shared/models/ClinicAtlas';

export default function EditClinicAtlasPage({
  params,
}: {
  params: { id: string };
}) {
  const [clinicAtlas, setClinicAtlas] = useState<ClinicAtlas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClinicAtlas = async () => {
      try {
        const data = await clinicAtlasesApi.getById(params.id);
        setClinicAtlas(data);
      } catch (error) {
        console.error('Error fetching clinic atlas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClinicAtlas();
  }, [params.id]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!clinicAtlas) {
    return <div>Клинический атлас не найден</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Редактирование клинического атласа</h1>
      <ClinicAtlasForm initialData={clinicAtlas} />
    </div>
  );
} 