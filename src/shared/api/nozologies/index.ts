import { API } from '../api';
import { axiosInstance } from '../axios';
import type { Nozology } from '@/shared/models/Nozology';
import type { BaseQueryParams, PaginatedResponse } from '../types';

export const nozologiesApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Nozology>>(
      API.getNozologies,
      { params }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Nozology>(API.getNozologyById(id));
    return data;
  },

  create: async (nozology: Omit<Nozology, '_id'>) => {
    const { data } = await axiosInstance.post<Nozology>(API.createNozology, nozology);
    return data;
  },

  update: async (id: string, nozology: Partial<Nozology>) => {
    const { data } = await axiosInstance.put<Nozology>(API.updateNozology(id), nozology);
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(API.deleteNozology(id));
  }
}; 