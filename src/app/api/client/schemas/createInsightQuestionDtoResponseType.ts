/**
 * Generated by orval v7.7.0 🍺
 * Do not edit manually.
 * Insight Questions API
 * API для работы с вопросами для инсайтов
 * OpenAPI spec version: 1.0.0
 */

/**
 * Тип ожидаемого ответа: 'int' - числовой ответ, 'variants_multiple' - выбор из нескольких вариантов
 */
export type CreateInsightQuestionDtoResponseType =
  (typeof CreateInsightQuestionDtoResponseType)[keyof typeof CreateInsightQuestionDtoResponseType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateInsightQuestionDtoResponseType = {
  int: 'int',
  variants_multiple: 'variants_multiple',
} as const;
