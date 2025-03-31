import { API } from '../api';
import { axiosInstance } from '../axios';
import type { Lection } from '@/shared/models/Lection';
import type { BaseQueryParams, PaginatedResponse } from '../types';

export const lectionsApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Lection>>(
      API.getLections,
      { params }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Lection>(API.getLectionById(id));
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await axiosInstance.post<Lection>(
      API.createLection,
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
    const { data } = await axiosInstance.put<Lection>(
      API.updateLection(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  getStatistics: async (id: string) => {
    const { data } = await axiosInstance.get<{
      views: number;
      active_time: number | null;
      notes: number | null;
      completed: number;
      active_time_average: number | null;
      notes_average: number | null;
    }>(API.getLectionStats(id));
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(API.deleteLection(id));
  },
};
