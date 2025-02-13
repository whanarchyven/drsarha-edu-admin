import { API } from '../api';
import { axiosInstance } from '../axios';
import type { Brochure } from '@/shared/models/Brochure';
import type { BaseQueryParams } from '../types';
import type { PaginatedResponse } from '../types';

export const brochuresApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Brochure>>(
      API.getBrochures,
      { params }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Brochure>(API.getBrochureById(id));
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await axiosInstance.post<Brochure>(
      API.createBrochure,
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
    const { data } = await axiosInstance.put<Brochure>(
      API.updateBrochure(id),
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
    await axiosInstance.delete(API.deleteBrochure(id));
  },
};
