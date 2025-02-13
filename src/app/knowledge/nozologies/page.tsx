'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EntityLayout } from '../_components/EntityLayout';
import { nozologiesApi } from '@/shared/api/nozologies';
import type { Nozology } from '@/shared/models/Nozology';
import type { BaseQueryParams } from '@/shared/api/types';

const columns = [
  { key: 'name', label: 'Название' },
  { key: 'description', label: 'Описание' },
];

export default function NozologiesPage() {
  const [data, setData] = useState<Nozology[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchData = async (params?: BaseQueryParams) => {
    setIsLoading(true);
    try {
      const response = await nozologiesApi.getAll({
        ...params,
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
  }, []);

  const handleSearch = (params: BaseQueryParams) => {
    fetchData(params);
  };

  const handleEdit = async (id: string) => {
    router.push(`/knowledge/nozologies/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await nozologiesApi.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCreate = () => {
    router.push('/knowledge/nozologies/create');
  };

  return (
    <EntityLayout
      title="Нозологии"
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
