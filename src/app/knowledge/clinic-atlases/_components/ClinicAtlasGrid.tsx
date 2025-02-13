'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/shared/ui/pagination';

import ClinicAtlasCard from '@/entities/clinic-atlas/ui/ClinicalAtlasCard'
import { ClinicAtlas } from '@/shared/models/ClinicAtlas';
import { clinicAtlasesApi } from '@/shared/api/clinic-atlases';
import { DeleteDialog } from '@/shared/ui/DeleteDialog/DeleteDialog';



interface ClinicAtlasGridProps {
  data: ClinicAtlas[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
  onPageChange: (page: number) => void;
}

export function ClinicAtlasGrid({ data, isLoading, pagination, onPageChange }: ClinicAtlasGridProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clinicAtlasToDelete, setClinicAtlasToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!clinicAtlasToDelete) return;

    try {
      setIsDeleting(true);
      await clinicAtlasesApi.delete(clinicAtlasToDelete);
      setIsDeleteDialogOpen(false);
      // Перезагружаем текущую страницу
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting clinic atlas:', error);
    } finally {
      setIsDeleting(false);
      setClinicAtlasToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setClinicAtlasToDelete(id);
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
      router.push(`/knowledge/clinic-atlases/${id}/edit`);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((atlas) => {
            if(atlas._id) {
              return (
                <ClinicAtlasCard 
                  key={atlas._id} 
                  _id={atlas._id} 
                  {...atlas}  
                  onDelete={() => openDeleteDialog(atlas._id!)}
                  onEdit={()=>{handleEdit(atlas._id!)}}
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
        Вы уверены, что хотите удалить клинический атлас?
      </DeleteDialog>
    </>
  );
} 