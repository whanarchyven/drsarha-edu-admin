export const translateKnowledgeType = (type: string) => {
  const translations = new Map<string, string>([
    ['clinic_task', 'Клиническая задача'],
    ['clinic_atlas', 'Клинический атлас'],
    ['interactive_task', 'Интерактивная задача'],
    ['brochure', 'Брошюра'],
    ['lection', 'Лекция'],
  ]);
  return translations.get(type);
};
