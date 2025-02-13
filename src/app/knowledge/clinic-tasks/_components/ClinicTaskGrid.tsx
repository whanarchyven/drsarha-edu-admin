'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/shared/ui/pagination';

import ClinicTaskCard from '@/entities/clinical-case/ui/ClinicalCaseCard';
import { ClinicTask } from '@/shared/models/ClinicTask';
import { clinicTasksApi } from '@/shared/api/clinic-tasks';
import { DeleteDialog } from '@/shared/ui/DeleteDialog/DeleteDialog';

interface ClinicTaskGridProps {
  data: ClinicTask[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
  onPageChange: (page: number) => void;
}

export function ClinicTaskGrid({
  data,
  isLoading,
  pagination,
  onPageChange,
}: ClinicTaskGridProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clinicTaskToDelete, setClinicTaskToDelete] = useState<string | null>(
    null
  );

  const handleDelete = async () => {
    if (!clinicTaskToDelete) return;

    try {
      setIsDeleting(true);
      await clinicTasksApi.delete(clinicTaskToDelete);
      setIsDeleteDialogOpen(false);
      // Перезагружаем текущую страницу
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting clinic atlas:', error);
    } finally {
      setIsDeleting(false);
      setClinicTaskToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setClinicTaskToDelete(id);
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
    router.push(`/knowledge/clinic-tasks/${id}/edit`);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((task) => {
            if (task._id) {
              return (
                <ClinicTaskCard
                  key={task._id}
                  _id={task._id}
                  {...task}
                  onDelete={() => openDeleteDialog(task._id!)}
                  onEdit={() => {
                    handleEdit(task._id!);
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

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}>
        Вы уверены, что хотите удалить клиническую задачу?
      </DeleteDialog>
    </>
  );
}
