import { useState } from "react";
import {
  CreateInsightQuestionDto,
  CreateSurveyResponseDto,
} from "@/app/api/client/schemas";
import {
  createInsightQuestionInsightQuestionsPost,
  useCreateInsightQuestionInsightQuestionsPost,
  useGetInsightQuestionInsightQuestionsGetQuestionIdGet,
  useListQuestionsInsightQuestionsListGet,
  deleteInsightQuestionInsightQuestionsQuestionIdDelete,
  createAndGainInsightsSurveyResponsesCreateAndGainInsightsPost,
  summaryByInsightQuestionIdInsightResultsSummaryByInsightQuestionIdInsightQuestionIdGet,
} from "@/app/api/sdk/insightQuestionsAPI";

export const useInsightQuestions = (search?: string) => {
  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    mutate,
  } = useListQuestionsInsightQuestionsListGet(
    search ? { title: search } : undefined
  );
  const questions = questionsData?.data ?? [];
  const [selectedQuestionsIds, setSelectedQuestionsIds] = useState<string[]>(
    []
  );

  const addInsightQuestion = async (question: CreateInsightQuestionDto) => {
    await createInsightQuestionInsightQuestionsPost(question);
    mutate(); // Обновляем список вопросов после добавления
  };
  const canCreateSurveyResponse = selectedQuestionsIds.length > 0;

  const getStats = async (questionId: string) => {
    const stats =
      summaryByInsightQuestionIdInsightResultsSummaryByInsightQuestionIdInsightQuestionIdGet(
        questionId
      )
        .then((d) => d.data)
        .then((d) => {
          return d;
        });
      return stats;
  };
  const createSurveyResponse = async (response: string) => {
    if (!canCreateSurveyResponse) {
      alert("Выберите хотя бы один вопрос");
      return;
    }
    await createAndGainInsightsSurveyResponsesCreateAndGainInsightsPost({
      response,
      insight_question_ids: selectedQuestionsIds,
    });
    mutate(); // Обновляем список вопросов после добавления
  };

  const deleteQuestion = async (questionId: string) => {
    await deleteInsightQuestionInsightQuestionsQuestionIdDelete(questionId);
    mutate(); // Обновляем список вопросов после удаления
  };

  return {
    questions,
    isLoadingQuestions,
    addInsightQuestion,
    deleteQuestion,
    selectedQuestionsIds,
    setSelectedQuestionsIds,
    createSurveyResponse,
    canCreateSurveyResponse,
    getStats,
  };
};

export const useInsightQuestion = (questionId: string) => {
  const { data: questionData, isLoading: isLoadingQuestion } =
    useGetInsightQuestionInsightQuestionsGetQuestionIdGet(questionId);
  const question = questionData?.data;
  return { question, isLoadingQuestion };
};
