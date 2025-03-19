import { API } from '../api';
import { axiosInstance } from '../axios';
import type { InteractiveQuiz } from '@/shared/models/InteractiveQuiz';
import type { BaseQueryParams, PaginatedResponse } from '../types';

export const interactiveQuizzesApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<
      PaginatedResponse<InteractiveQuiz>
    >(API.getInteractiveQuizzes, {
      params,
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<InteractiveQuiz>(
      API.getInteractiveQuizById(id)
    );
    return data;
  },

  create: async (formData: FormData) => {
    console.log(formData.entries(), 'FORM DATA');
    const { data } = await axiosInstance.post<InteractiveQuiz>(
      API.createInteractiveQuiz,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  update: async (id: string, formData: FormData) => {
    const { data } = await axiosInstance.put<InteractiveQuiz>(
      API.updateInteractiveQuiz(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(API.deleteInteractiveQuiz(id));
  },
};
