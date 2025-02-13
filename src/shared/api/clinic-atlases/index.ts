import { API } from '../api';
import { axiosInstance } from '../axios';
import type { ClinicAtlas } from '@/shared/models/ClinicAtlas';
import type { BaseQueryParams, PaginatedResponse } from '../types';

export const clinicAtlasesApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<PaginatedResponse<ClinicAtlas>>(
      API.getClinicAtlases,
      { params }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<ClinicAtlas>(
      API.getClinicAtlasById(id)
    );
    return data;
  },

  create: (data: FormData) =>
    axiosInstance.post<ClinicAtlas>(API.createClinicAtlas, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  update: (id: string, data: FormData) =>
    axiosInstance.put<ClinicAtlas>(API.updateClinicAtlas(id), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  delete: async (id: string) => {
    await axiosInstance.delete(API.deleteClinicAtlas(id));
  },
};
