'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/shared/ui/pagination';
import { DeleteLectionDialog } from './DeleteLectionDialog';
import { lectionsApi } from '@/shared/api/lections';
import type { Lection } from '@/shared/models/Lection';
import LectionCard from '@/components/ui/lection-card';

interface LectionsGridProps {
  data: Lection[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
  onPageChange: (page: number) => void;
}

export function LectionsGrid({
  data,
  isLoading,
  pagination,
  onPageChange,
}: LectionsGridProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lectionToDelete, setLectionToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!lectionToDelete) return;

    try {
      setIsDeleting(true);
      await lectionsApi.delete(lectionToDelete);
      setIsDeleteDialogOpen(false);
      // Перезагружаем текущую страницу
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting lection:', error);
    } finally {
      setIsDeleting(false);
      setLectionToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setLectionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  const handleEdit = (id: string) => {
    router.push(`/knowledge/lections/${id}/edit`);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((lection) => {
            if (lection._id) {
              return (
                <LectionCard
                  key={lection._id}
                  id={lection._id}
                  {...lection}
                  onDelete={() => openDeleteDialog(lection._id!)}
                  onEdit={() => {
                    handleEdit(lection._id!);
                  }}
                />
              );
            }
          })}
        </div>

        {pagination.totalPages >= 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Всего: {pagination?.total}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      <DeleteLectionDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
