'use client';

import { useEffect } from 'react';

import { useNozologiesStore } from '@/shared/store/nozologiesStore';
import { CourseForm } from '../_components/CourseForm';
export default function CreateLectionPage() {
  const { fetchNozologies } = useNozologiesStore();

  useEffect(() => {
    fetchNozologies();
  }, [fetchNozologies]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <CourseForm />
    </div>
  );
}
