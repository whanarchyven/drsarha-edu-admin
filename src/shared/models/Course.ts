import type { KnowledgeBaseElementType } from './types/KnowledgeBaseElementType.ts';

export interface Course {
  _id?: string;
  name: string;
  cover_image: string;
  duration: string;
  stars: number;
  description: string;
  nozology: string;
  stages: {
    name: string;
    type: KnowledgeBaseElementType;
    knowledge_ref: string;
  }[];
}
