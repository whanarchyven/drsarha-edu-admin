import { API } from '../api';
import { axiosInstance } from '../axios';
import type { Company } from '@/entities/company/model';
import type { BaseQueryParams, PaginatedResponse } from '../types';

export const companiesApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Company>>(
      API.getCompanies,
      { params }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Company>(
      API.getCompanyById(id)
    );
    return data;
  },

  create: async (companyData: Omit<Company, '_id' | 'created_at' | 'updated_at'>) => {
    const { data } = await axiosInstance.post<Company>(
      API.createCompany,
      companyData
    );
    return data;
  },

  update: async (id: string, companyData: Partial<Omit<Company, '_id' | 'created_at' | 'updated_at'>>) => {
    const { data } = await axiosInstance.put<Company>(
      API.updateCompany(id),
      companyData
    );
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(API.deleteCompany(id));
  },
};
