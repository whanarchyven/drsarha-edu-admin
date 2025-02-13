'use client';

import { Suspense } from 'react';

export function ClientComponent({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Загрузка...</div>}>{children}</Suspense>;
}
