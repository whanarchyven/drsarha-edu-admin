'use client';

import { EntityList } from './EntityList';
import type { BaseQueryParams } from '@/shared/api/types';
import { Pagination } from "@/shared/ui/pagination";

interface EntityLayoutProps {
  title: string;
  data: any[];
  columns: { key: string; label: string }[];
  isLoading?: boolean;
  onSearch: (params: { search?: string; page?: number }) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const EntityLayout = ({
  title,
  data,
  columns,
  isLoading,
  onSearch,
  onEdit,
  onDelete,
  onCreate,
  pagination
}: EntityLayoutProps) => {
  const handlePageChange = (page: number) => {
    onSearch({ page });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button 
          onClick={onCreate}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Создать
        </button>
      </div>
      
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <EntityList
          data={data}
          columns={columns}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Всего: {pagination.total}
        </div>
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}; 