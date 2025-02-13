'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/shared/ui/pagination';

import InteractiveTaskCard from '@/entities/interactive-task/ui/InteractiveTaskCard'
import { InteractiveTask } from '@/shared/models/InteractiveTask';
import { interactiveTasksApi } from '@/shared/api/interactive-tasks';
import { DeleteDialog } from '@/shared/ui/DeleteDialog/DeleteDialog';



interface InteractiveTaskGridProps {
  data: InteractiveTask[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
  onPageChange: (page: number) => void;
}

export function InteractiveTaskGrid({ data, isLoading, pagination, onPageChange }: InteractiveTaskGridProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [interactiveTaskToDelete, setInteractiveTaskToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!interactiveTaskToDelete) return;

    try {
      setIsDeleting(true);
      await interactiveTasksApi.delete(interactiveTaskToDelete);
      setIsDeleteDialogOpen(false);
      // Перезагружаем текущую страницу
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting interactive task:', error);
    } finally {
      setIsDeleting(false);
      setInteractiveTaskToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setInteractiveTaskToDelete(id);
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
      router.push(`/knowledge/interactive-tasks/${id}/edit`);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((task) => {
            if(task._id) {
              return (
                <InteractiveTaskCard 
                  key={task._id} 
                  _id={task._id} 
                  {...task}  
                  onDelete={() => openDeleteDialog(task._id!)}
                  onEdit={()=>{handleEdit(task._id!)}}
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
        isLoading={isDeleting}
      >
        Вы уверены, что хотите удалить интерактивную задачу?
      </DeleteDialog>
    </>
  );
} 