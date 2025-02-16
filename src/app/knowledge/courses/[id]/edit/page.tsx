'use client';

import { useEffect, useState } from 'react';
import { coursesApi } from '@/shared/api/courses';
import type { Course } from '@/shared/models/Course';
import { CourseForm } from '../../_components/CourseForm';

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await coursesApi.getById(params.id);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [params.id]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!course) {
    return <div>Курс не найден</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Редактирование курса</h1>
      <CourseForm initialData={course} />
    </div>
  );
}
