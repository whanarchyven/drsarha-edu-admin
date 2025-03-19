export type Error = {
  message: string;
  code: number;
  customData: any;
};

export type TRequestStatuses = 'init' | 'pending' | 'fulfilled' | 'rejected';

export interface IResponse<D = any> {
  status: 'success' | 'error';
  data: D;
  errors: Error[];
}

export const API = {
  // Нозологии
  getNozologies: '/nozologies',
  getNozologyById: (id: string) => `/nozologies/${id}`,
  createNozology: '/nozologies',
  updateNozology: (id: string) => `/nozologies/${id}`,
  deleteNozology: (id: string) => `/nozologies/${id}`,

  // Брошюры
  getBrochures: '/brochures',
  getBrochureById: (id: string) => `/brochures/${id}`,
  createBrochure: '/brochures',
  updateBrochure: (id: string) => `/brochures/${id}`,
  deleteBrochure: (id: string) => `/brochures/${id}`,

  // Лекции
  getLections: '/lections',
  getLectionById: (id: string) => `/lections/${id}`,
  createLection: '/lections',
  updateLection: (id: string) => `/lections/${id}`,
  deleteLection: (id: string) => `/lections/${id}`,

  // Клинические задачи
  getClinicTasks: '/clinic-tasks',
  getClinicTaskById: (id: string) => `/clinic-tasks/${id}`,
  createClinicTask: '/clinic-tasks',
  updateClinicTask: (id: string) => `/clinic-tasks/${id}`,
  deleteClinicTask: (id: string) => `/clinic-tasks/${id}`,

  // Клинические атласы
  getClinicAtlases: '/clinic-atlases',
  getClinicAtlasById: (id: string) => `/clinic-atlases/${id}`,
  createClinicAtlas: '/clinic-atlases',
  updateClinicAtlas: (id: string) => `/clinic-atlases/${id}`,
  deleteClinicAtlas: (id: string) => `/clinic-atlases/${id}`,

  // Интерактивные задачи
  getInteractiveTasks: '/interactive-tasks',
  getInteractiveTaskById: (id: string) => `/interactive-tasks/${id}`,
  createInteractiveTask: '/interactive-tasks',
  updateInteractiveTask: (id: string) => `/interactive-tasks/${id}`,
  deleteInteractiveTask: (id: string) => `/interactive-tasks/${id}`,

  // Курсы
  getCourses: '/courses',
  getCourseById: (id: string) => `/courses/${id}`,
  createCourse: '/courses',
  updateCourse: (id: string) => `/courses/${id}`,
  deleteCourse: (id: string) => `/courses/${id}`,

  // Интерактивные викторины
  getInteractiveQuizzes: '/interactive-quizzes',
  getInteractiveQuizById: (id: string) => `/interactive-quizzes/${id}`,
  createInteractiveQuiz: '/interactive-quizzes',
  updateInteractiveQuiz: (id: string) => `/interactive-quizzes/${id}`,
  deleteInteractiveQuiz: (id: string) => `/interactive-quizzes/${id}`,
} as const;
