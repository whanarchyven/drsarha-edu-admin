'use client';
import { useInsightQuestions } from '@/shared/hooks/use-insight-questions';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { InsightQuestion } from '@/entities/insight-question/ui';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InsightQuestionForm } from '@/components/insight-question-form';
import {
  BaseInsightQuestionDto,
  CreateInsightQuestionDto,
} from '@/app/api/client/schemas';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
const QuestionsPage = () => {
  const [search, setSearch] = useState<string>('');
  const {
    questions,
    isLoadingQuestions,
    addInsightQuestion,
    deleteQuestion,
    createSurveyResponse,
    selectedQuestionsIds,
    setSelectedQuestionsIds,
    canCreateSurveyResponse,
    getStats,
  } = useInsightQuestions(search);

  console.log(questions, 'QUESTIONS');
  const [createPopOpen, setCreatePopOpen] = useState(false);
  const [deletePopOpen, setDeletePopOpen] = useState(false);

  const [questionToDelete, setQuestionToDelete] =
    useState<BaseInsightQuestionDto | null>(null);

  const handleAddInsightQuestion = async (data: CreateInsightQuestionDto) => {
    await addInsightQuestion({
      ...data,
      llm_model: 'gpt-4o',
      llm_temperature: 0,
    });

    setCreatePopOpen(false);
  };

  return (
    <div className="bg-slate-100 p-4 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Вопросы</h1>
        <Button onClick={() => setCreatePopOpen(true)}>Добавить вопрос</Button>
      </div>
      <Input
        placeholder="Поиск"
        className="mt-4 bg-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex mt-4 flex-col gap-4">
        {isLoadingQuestions ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          questions.map((question: BaseInsightQuestionDto) => (
            <InsightQuestion
              setQuestionToDelete={setQuestionToDelete}
              getStats={getStats}
              key={question.id}
              question={question}
            />
          ))
        )}
      </div>
      <Dialog open={createPopOpen} onOpenChange={setCreatePopOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить вопрос</DialogTitle>
          </DialogHeader>
          <InsightQuestionForm
            onSubmit={handleAddInsightQuestion}
            onCancel={() => setCreatePopOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={questionToDelete != null}
        onOpenChange={() => setQuestionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить вопрос</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить вопрос? Отменить это действие будет
            невозможно.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button onClick={() => setQuestionToDelete(null)}>Отмена</Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteQuestion(questionToDelete?.id ?? '');
                setQuestionToDelete(null);
                toast.success('Вопрос удален');
              }}>
              Удалить
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionsPage;
