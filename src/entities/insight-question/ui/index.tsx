'use client';
import { BaseInsightQuestionDto } from '@/app/api/client/schemas';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartColumnIncreasing, Pencil, Trash } from 'lucide-react';
import { useInsightQuestion } from '@/shared/hooks/use-insight-questions';
import { useState } from 'react';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { copyToClipboard } from '@/shared/utils/copyToClipboard';
import { toast } from 'sonner';
import MergeTable, { Stat } from '@/components/merge-table';

interface InsightQuestionProps {
  question: BaseInsightQuestionDto;
  getStats?: (id: string) => Promise<any>;
  setQuestionToDelete?: (question: BaseInsightQuestionDto) => void;
  hideBtns?: boolean;
}

export const InsightQuestion = ({
  question,
  getStats,
  setQuestionToDelete,
  hideBtns = false,
}: InsightQuestionProps) => {
  const [openStats, setOpenStats] = useState(false);
  const [stats, setStats] = useState<any[]>([]);

  const [average, setAverage] = useState<number | null>(null);

  const handleShowStats = async () => {
    if (!getStats) return;
    const stats = await getStats(question.id ?? '');
    console.log(stats, 'STATS');
    setStats(stats.results);
    if (stats.avg) {
      setAverage(stats.avg);
    }
    setOpenStats(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col  gap-2 ">
        <div className="flex flex-row items-center gap-2 justify-between w-full">
          <div className="flex flex-row items-center gap-4">
            <CardTitle>{question.title}</CardTitle>
            <Badge variant="default">
              {question.response_type === 'int' ? 'Числовой' : 'Варианты'}
            </Badge>
          </div>
          {!hideBtns && (
            <div className="flex flex-row items-center gap-2">
              <Button onClick={handleShowStats} variant="info">
                <ChartColumnIncreasing className="w-4 h-4 stroke-white" />
              </Button>
              <Button
                onClick={() => {
                  if (setQuestionToDelete) setQuestionToDelete(question);
                }}
                variant="destructive">
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <Badge
          onClick={async () => {
            await copyToClipboard(question.id ?? '');
            toast.success('ID скопирован в буфер обмена');
          }}
          className="w-fit cursor-pointer"
          variant="outline">
          ID: {question.id}
        </Badge>
      </CardHeader>
      <CardContent>
        <p>{question.prompt}</p>
        {question.response_type == 'variants_multiple' && (
          <div className="flex p-2 border rounded-md flex-col mt-4 gap-2">
            <p className="text-sm font-medium">Варианты ответов:</p>
            <div className="flex items-center flex-wrap gap-2">
              {question?.response_variants?.map((variant, index) => (
                <Badge key={index} className="w-fit" variant="outline">
                  {variant}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {openStats && (
          <div className="flex flex-col gap-2 mt-4 p-2 border rounded-md">
            <p className="text-sm font-bold">Статистика:</p>
            {average && (
              <p className="text-sm font-medium">Среднее значение: {average}</p>
            )}
            <MergeTable initialStats={stats as Stat[]} questionId={question.id ?? ''} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
