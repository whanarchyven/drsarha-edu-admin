'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EntityContextMenu } from './EntityContextMenu';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

interface Column {
  key: string;
  label: string;
}

interface EntityListProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EntityList({ data = [], columns, isLoading, onEdit, onDelete }: EntityListProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
          <TableHead className="w-[100px]">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(data) && data.map((item) => (
          <EntityContextMenu
            key={item._id}
            onEdit={() => onEdit(item._id)}
            onDelete={() => onDelete(item._id)}
          >
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>{item[column.key]}</TableCell>
              ))}
            </TableRow>
          </EntityContextMenu>
        ))}
      </TableBody>
    </Table>
  );
} 