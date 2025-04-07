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
import { getConfigNamesMapGetConfigGet, pushConfigNamesMapPushConfigPost } from '@/app/api/sdk/insightQuestionsAPI';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface Stat {
  value: string;
  count: number;
}

export default function MergeTable({ initialStats,questionId }: { initialStats: Stat[],questionId:string }) {
  // Состояние для хранения списка статистики
  const [stats, setStats] = useState<Stat[]>(initialStats);
  
  // Выбранные варианты для объединения
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  
  // Состояние диалога
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Каноническое значение
  const [canonicalValue, setCanonicalValue] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  // Функция для переключения выбора варианта
  const toggleVariant = (value: string) => {
    if (selectedVariants.includes(value)) {
      setSelectedVariants(selectedVariants.filter(v => v !== value));
    } else {
      setSelectedVariants([...selectedVariants, value]);
    }
  };

  // Функция для очистки выбранных вариантов
  const clearSelection = () => {
    setSelectedVariants([]);
  };

  // Функция для открытия диалога ввода канонического имени
  const openMergeDialog = () => {
    
    setDialogOpen(true);
    setCanonicalValue('');
  };

  // Функция для завершения объединения
  const completeMerge = async () => {
    if (!canonicalValue.trim()) {
      toast.error('Введите каноническое имя');
      return;
    }

    setIsLoading(true);
    
    try {
      // Создаем объект маппингов для API
      const mappingsObject: Record<string, string> = {};
      
      // Каждый выбранный вариант как ключ, каноническое значение как значение
      selectedVariants.forEach(variant => {
        const key = variant.toLowerCase().split('(*)')[0].trim();
        mappingsObject[key] = canonicalValue.trim();
      });
      
      console.log('Объект маппингов для API:', mappingsObject);

      const alreadyExistsConfig = await getConfigNamesMapGetConfigGet();
      console.log('Уже существующие конфигурации:', alreadyExistsConfig.data);
      console.log({[`${questionId}`]:{...mappingsObject}});
      console.log({[`${questionId}`]:{...mappingsObject, ...alreadyExistsConfig.data}});

      let newData={...alreadyExistsConfig.data};
      newData[`${questionId}`]={...mappingsObject, ...alreadyExistsConfig.data[`${questionId}`]};
      console.log('newData',newData);
      const res = await pushConfigNamesMapPushConfigPost({
        ...newData
      });
      
      console.log('Ответ от сервера:', res);
      setIsLoading(false);
      setSelectedVariants([]);
      setDialogOpen(false);
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
                  selectedVariants.includes(stat.value) ? 'bg-muted/50' : ''
                }>
                <TableCell>{stat.value}</TableCell>
                <TableCell>{stat.count}</TableCell>
                <TableCell>
                  <Button
                    variant={selectedVariants.includes(stat.value) ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => toggleVariant(stat.value)}>
                    <Combine className="h-4 w-4 mr-1" />
                    {selectedVariants.includes(stat.value) ? 'Отменить' : 'Выбрать'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedVariants.length > 0 && (
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Выбранные варианты для объединения:</h3>
          <div className="space-y-2 mb-4">
            <div className="flex flex-wrap gap-2">
              {selectedVariants.map((variant, index) => (
                <Badge key={index} variant="outline" className="text-sm flex items-center gap-1">
                  {variant}
                  <button 
                    className="ml-1 rounded-full hover:bg-muted p-0.5" 
                    onClick={() => toggleVariant(variant)}>
                    <X className="h-3 w-3" />
                    <span className="sr-only">Удалить</span>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={openMergeDialog} variant="default">
              Объединить
            </Button>
            <Button onClick={clearSelection} variant="outline">
              Очистить
            </Button>
          </div>
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Введите каноническое имя</DialogTitle>
            <DialogDescription>
              Это имя будет использоваться как стандартное значение для всех выбранных вариантов.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="canonical-name">Каноническое имя</Label>
              <Input 
                id="canonical-name" 
                value={canonicalValue}
                onChange={(e) => setCanonicalValue(e.target.value)}
                placeholder="Введите стандартное имя"
                autoFocus
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Выбранные варианты:</p>
              <div className="flex flex-wrap gap-2">
                {selectedVariants.map((variant, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {variant}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setDialogOpen(false)} 
              variant="outline"
              disabled={isLoading}>
              Отмена
            </Button>
            <Button 
              onClick={completeMerge} 
              disabled={isLoading || !canonicalValue.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Обработка...
                </>
              ) : (
                'Объединить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
