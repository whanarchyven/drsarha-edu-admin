import { API } from '../api';
import { axiosInstance } from '../axios';
import type { ClinicTask } from '@/shared/models/ClinicTask';
import type { BaseQueryParams, PaginatedResponse } from '../types';

export const clinicTasksApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<PaginatedResponse<ClinicTask>>(
      API.getClinicTasks,
      { params }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<ClinicTask>(
      API.getClinicTaskById(id)
    );
    return data;
  },

  create: async (formData: any) => {
    console.log(formData, 'formData');
    const { data } = await axiosInstance.post<ClinicTask>(
      API.createClinicTask,
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
    const { data } = await axiosInstance.put<ClinicTask>(
      API.updateClinicTask(id),
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
      completed: number;
    }>(API.getClinicTaskStats(id));
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(API.deleteClinicTask(id));
  },
};
