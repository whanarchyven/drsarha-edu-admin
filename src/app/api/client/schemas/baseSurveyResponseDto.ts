/**
 * Generated by orval v7.7.0 🍺
 * Do not edit manually.
 * Insight Questions API
 * API для работы с вопросами для инсайтов
 * OpenAPI spec version: 1.0.0
 */
import type { BaseSurveyResponseDtoInsightStatus } from './baseSurveyResponseDtoInsightStatus';

export interface BaseSurveyResponseDto {
  /** Идентификатор ответа на опрос */
  id: string;
  /** Идентификаторы вопросов для инсайта */
  insight_question_ids: string[];
  /** Ответ на опрос */
  response: string;
  /** Статус инсайта */
  insight_status: BaseSurveyResponseDtoInsightStatus;
  /** Дата и время создания ответа на опрос */
  created_at: string;
}
