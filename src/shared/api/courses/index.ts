import { API } from '../api';
import { axiosInstance } from '../axios';
import type { Course } from '@/shared/models/Course';
import type { BaseQueryParams, PaginatedResponse } from '../types';

export const coursesApi = {
  getAll: async (params?: BaseQueryParams) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Course>>(
      API.getCourses,
      {
        params,
      }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Course>(API.getCourseById(id));
    return data;
  },

  create: async (course: FormData) => {
    const { data } = await axiosInstance.post<Course>(
      API.createCourse,
      course,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  update: async (id: string, course: Partial<Course>) => {
    const { data } = await axiosInstance.put<Course>(
      API.updateCourse(id),
      course
    );
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(API.deleteCourse(id));
  },
};
