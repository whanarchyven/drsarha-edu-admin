'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EntityLayout } from '../_components/EntityLayout';
import { brochuresApi } from '@/shared/api/brochures';
import type { Brochure } from '@/shared/models/Brochure';
import type { BaseQueryParams } from '@/shared/api/types';
import { BrochureGrid } from './_components/BrochureGrid';

const columns = [
  { key: 'name', label: 'Название' },
  { key: 'description', label: 'Описание' },
  { key: 'fileUrl', label: 'Файл' }
];

export default function BrochuresPage() {
  const [data, setData] = useState<Brochure[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  }>({
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchData = async (params?: BaseQueryParams) => {
    setIsLoading(true);
    console.log('params', params);
    try {
      const response = await brochuresApi.getAll(params);
      console.log('response', response);
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
    const params: BaseQueryParams = {};
    searchParams.forEach((value, key) => {
      params[key as keyof BaseQueryParams] = value;
    });
    fetchData(params);
  }, [searchParams]);

  const handleSearch = (params: { search?: string; page?: number }) => {
    fetchData({
      search: params.search,
      page: params.page,
      limit: 12
    });
  };

  const handleEdit = (id: string) => {
    router.push(`/knowledge/brochures/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await brochuresApi.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCreate = () => {
    router.push(`/knowledge/brochures/create`);
    console.log('Create new brochure');
  };

  console.log('data BROCHURES', data);

  return (
    <BrochureGrid
      pagination={pagination}
      data={data}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
      onSearch={handleSearch}
    />
  );
} 