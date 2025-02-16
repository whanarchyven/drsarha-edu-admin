'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

const navItems = [
  {
    name: 'База знаний',
    path: '/knowledge',
    children: [
      { name: 'Курсы', path: '/knowledge/courses' },
      { name: 'Брошюры', path: '/knowledge/brochures' },
      { name: 'Лекции', path: '/knowledge/lections' },
      { name: 'Клинические задачи', path: '/knowledge/clinic-tasks' },
      { name: 'Клинические атласы', path: '/knowledge/clinic-atlases' },
      { name: 'Интерактивные задачи', path: '/knowledge/interactive-tasks' },
    ],
  },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <div className="text-xl font-bold mb-8">DrSarha Edu Admin</div>
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <div key={item.path}>
            <Link
              href={item.path}
              className={cn(
                'p-2 rounded hover:bg-gray-700 transition-colors block',
                pathname === item.path && 'bg-gray-700'
              )}>
              {item.name}
            </Link>

            {item.children && (
              <div className="ml-4 mt-2 flex flex-col gap-1">
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    href={child.path}
                    className={cn(
                      'p-2 rounded hover:bg-gray-700 transition-colors block text-sm',
                      pathname === child.path && 'bg-gray-700'
                    )}>
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
