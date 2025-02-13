'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNozologiesStore } from '@/shared/store/nozologiesStore';

import type { BaseQueryParams } from '@/shared/api/types';
import { InteractiveTaskGrid } from './_components/InteractiveTaskGrid';
import { interactiveTasksApi } from '@/shared/api/interactive-tasks';
import type { InteractiveTask } from '@/shared/models/InteractiveTask';

export default function ClinicAtlasesPage() {
  const router = useRouter();
  const [data, setData] = useState<InteractiveTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const { fetchNozologies } = useNozologiesStore();
  const currentNozologyId = searchParams.get('nozologyId');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false
  });

  const fetchData = async (params?: BaseQueryParams) => {
    setIsLoading(true);
    try {
      const response = await interactiveTasksApi.getAll({
        ...params,
        nozologyId: currentNozologyId || undefined,
        search: searchQuery || undefined,
        page: params?.page || 1,
        limit: 12
      });
      console.log(response);
      setData(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        hasMore: response.hasMore
      });
    } catch (error) {
      console.error('Error fetching clinic atlases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNozologies();
    fetchData();
  }, [currentNozologyId, searchQuery]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Интерактивные задачи</h1>
        <Button onClick={() => router.push('/knowledge/interactive-tasks/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Создать интерактивную задачу
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Поиск интерактивных задач..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <InteractiveTaskGrid
        data={data}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => fetchData({ page })}
      />
    </div>
  );
} 