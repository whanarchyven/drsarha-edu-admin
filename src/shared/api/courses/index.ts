import { API } from '../api';
import { axiosInstance } from '../axios';
import type { Course } from '@/shared/models/Course';
import type { BaseQueryParams } from '../types';

export const coursesApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<Course[]>(API.getCourses, { 
      params 
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Course>(API.getCourseById(id));
    return data;
  },

  create: async (course: Omit<Course, '_id'>) => {
    const { data } = await axiosInstance.post<Course>(API.createCourse, course);
    return data;
  },

  update: async (id: string, course: Partial<Course>) => {
    const { data } = await axiosInstance.put<Course>(API.updateCourse(id), course);
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(API.deleteCourse(id));
  }
}; 