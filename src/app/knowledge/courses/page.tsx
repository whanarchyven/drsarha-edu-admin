'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EntityLayout } from '../_components/EntityLayout';
import { coursesApi } from '@/shared/api/courses';
import type { Course } from '@/shared/models/Course';
import type { BaseQueryParams } from '@/shared/api/types';

const columns = [
  { key: 'name', label: 'Название' },
  { key: 'duration', label: 'Длительность' },
  { key: 'stars', label: 'Рейтинг' },
];

export default function CoursesPage() {
  const [data, setData] = useState<Course[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const currentNozologyId = searchParams.get('nozologyId');

  const fetchData = async (params?: BaseQueryParams) => {
    setIsLoading(true);
    try {
      const response = await coursesApi.getAll({
        ...params,
        nozologyId: currentNozologyId || undefined,
        page: params?.page || 1,
        limit: 10,
      });
      setData(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        hasMore: response.hasMore,
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
      await coursesApi.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCreate = () => {
    // TODO: Реализовать создание
    console.log('Create new course');
  };

  return (
    <EntityLayout
      title="Курсы"
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
