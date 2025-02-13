'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { axiosInstance } from '@/shared/api/axios';

interface Course {
  id: string;
  name: string;
  cover_image: string;
  duration: string;
  stars: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axiosInstance.get('/courses');
      setCourses(response.data);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Курсы</h1>
        <Button>Создать курс</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4">
            <img
              src={course.cover_image}
              alt={course.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-bold">{course.name}</h3>
            <p>Длительность: {course.duration}</p>
            <p>Рейтинг: {course.stars}/5</p>
          </div>
        ))}
      </div>
    </div>
  );
}
