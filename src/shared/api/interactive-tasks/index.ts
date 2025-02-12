import { API } from '../api';
import { axiosInstance } from '../axios';
import type { InteractiveTask } from '@/shared/models/InteractiveTask';
import type { BaseQueryParams } from '../types';

export const interactiveTasksApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<InteractiveTask[]>(API.getInteractiveTasks, { 
      params 
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<InteractiveTask>(API.getInteractiveTaskById(id));
    return data;
  },

  create: async (task: Omit<InteractiveTask, '_id'>) => {
    const { data } = await axiosInstance.post<InteractiveTask>(API.createInteractiveTask, task);
    return data;
  },

  update: async (id: string, task: Partial<InteractiveTask>) => {
    const { data } = await axiosInstance.put<InteractiveTask>(API.updateInteractiveTask(id), task);
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(API.deleteInteractiveTask(id));
  }
}; 