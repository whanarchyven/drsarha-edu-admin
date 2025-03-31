'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Combine, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { pushConfigNamesMapPushConfigPost } from '@/app/api/sdk/insightQuestionsAPI';
import { toast } from 'sonner';
export interface Stat {
  value: string;
  count: number;
}

interface MergeMapping {
  source: string;
  target: string;
}

export default function MergeTable({ initialStats }: { initialStats: Stat[] }) {
  // Sample data for the demo - now without IDs
  const [stats, setStats] = useState<Stat[]>(initialStats);

  // State to track which row is in "merge mode" - now using value instead of id
  const [mergeSourceValue, setMergeSourceValue] = useState<string | null>(null);

  // State to track merged mappings
  const [mergeMappings, setMergeMappings] = useState<MergeMapping[]>([]);

  // Function to start merge mode
  const startMerge = (value: string) => {
    setMergeSourceValue(value);
  };

  // Function to cancel merge mode and reset all mappings
  const cancelMerge = () => {
    setMergeSourceValue(null);
    setMergeMappings([]);
  };

  // Function to check if a mapping exists
  const mappingExists = (sourceValue: string, targetValue: string) => {
    return mergeMappings.some(
      (mapping) =>
        mapping.source === sourceValue && mapping.target === targetValue
    );
  };

  // Function to add a mapping
  const addMapping = (sourceValue: string, targetValue: string) => {
    // Check if this mapping already exists
    if (!mappingExists(sourceValue, targetValue)) {
      setMergeMappings([
        ...mergeMappings,
        { source: sourceValue, target: targetValue },
      ]);
    }
  };

  // Function to remove a specific mapping by source and target values
  const removeMappingByValues = (sourceValue: string, targetValue: string) => {
    const newMappings = mergeMappings.filter(
      (mapping) =>
        !(mapping.source === sourceValue && mapping.target === targetValue)
    );
    setMergeMappings(newMappings);
  };

  // Function to remove a mapping by index
  const removeMapping = (index: number) => {
    const newMappings = [...mergeMappings];
    newMappings.splice(index, 1);
    setMergeMappings(newMappings);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleMerge = async () => {
    setIsLoading(true);
    console.log(mergeMappings);
    try {
      const res = await pushConfigNamesMapPushConfigPost({
        mappings: mergeMappings.map((m) => ({
          [String(m.source.split('(*)')[0]).toLowerCase()]: String(
            m.target.split('(*)')[0]
          ),
        })),
      });
      console.log(res);
      setIsLoading(false);
      setMergeMappings([]);
      toast.success('Варианты ответов объединены');
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error('Ошибка при объединении вариантов ответов');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Вариант ответа</TableHead>
              <TableHead>Количество ответов</TableHead>
              <TableHead className="w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow
                key={stat.value}
                className={
                  mergeSourceValue === stat.value ? 'bg-muted/50' : ''
                }>
                <TableCell>{stat.value}</TableCell>
                <TableCell>{stat.count}</TableCell>
                <TableCell>
                  {!mergeSourceValue && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startMerge(stat.value)}>
                      <Combine className="h-4 w-4 " />
                    </Button>
                  )}

                  {mergeSourceValue && mergeSourceValue !== stat.value && (
                    <Button
                      variant={
                        mappingExists(mergeSourceValue, stat.value)
                          ? 'destructive'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => {
                        if (mappingExists(mergeSourceValue, stat.value)) {
                          removeMappingByValues(mergeSourceValue, stat.value);
                        } else {
                          addMapping(mergeSourceValue, stat.value);
                        }
                      }}>
                      {mappingExists(mergeSourceValue, stat.value)
                        ? 'Удалить'
                        : 'Добавить'}
                    </Button>
                  )}

                  {mergeSourceValue && mergeSourceValue === stat.value && (
                    <Button variant="outline" size="sm" onClick={cancelMerge}>
                      Отмена
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {mergeSourceValue && (
        <div className="bg-muted p-4 rounded-md">
          <p className="font-medium mb-2">
            Выбран вариант для объединения:{' '}
            <span className="text-primary">{mergeSourceValue}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            Нажмите `&quot;Добавить&quot;` у других вариантов, чтобы объединить
            их с выбранным, или `&quot;Отмена&quot;` для выхода из режима
            объединения и сброса всех связей.
          </p>
        </div>
      )}

      {mergeMappings.length > 0 && (
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Объединенные варианты:</h3>
          <div className="space-y-2">
            {mergeMappings.map((mapping, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {mapping.source} → {mapping.target}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeMapping(index)}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Удалить объединение</span>
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button onClick={handleMerge} variant="default">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Объединить'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
