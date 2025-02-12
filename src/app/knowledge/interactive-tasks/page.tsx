'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EntityLayout } from '../_components/EntityLayout';
import { interactiveTasksApi } from '@/shared/api/interactive-tasks';
import type { InteractiveTask } from '@/shared/models/InteractiveTask';
import type { BaseQueryParams } from '@/shared/api/types';

const columns = [
  { key: 'name', label: 'Название' },
  { key: 'description', label: 'Описание' },
  { key: 'difficulty', label: 'Сложность' },
  { key: 'type', label: 'Тип задачи' }
];

export default function InteractiveTasksPage() {
  const [data, setData] = useState<InteractiveTask[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const currentNozologyId = searchParams.get('nozologyId');

  const fetchData = async (params?: BaseQueryParams) => {
    setIsLoading(true);
    try {
      const response = await interactiveTasksApi.getAll({
        ...params,
        nozologyId: currentNozologyId || undefined,
        page: params?.page || 1,
        limit: 10
      });
      setData(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        hasMore: response.hasMore
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentNozologyId]);

  const handleSearch = (params: BaseQueryParams) => {
    fetchData(params);
  };

  const handleEdit = async (id: string) => {
    // TODO: Реализовать редактирование
    console.log('Edit:', id);
  };

  const handleDelete = async (id: string) => {
    try {
      await interactiveTasksApi.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCreate = () => {
    // TODO: Реализовать создание
    console.log('Create new interactive task');
  };

  return (
    <EntityLayout
      title="Интерактивные задачи"
      data={data}
      columns={columns}
      isLoading={isLoading}
      pagination={pagination}
      onSearch={handleSearch}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
} 