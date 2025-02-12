'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useNozologiesStore } from '@/shared/store/nozologiesStore';
import { EntityContextMenu } from './_components/EntityContextMenu';
import { nozologiesApi } from '@/shared/api/nozologies';

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentNozologyId = searchParams.get('nozologyId');
  
  const { items, fetchNozologies } = useNozologiesStore();

  useEffect(() => {
    fetchNozologies({
      limit: 100 // Получаем все нозологии для табов
    });
  }, [pathname, fetchNozologies]);

  // Редирект на courses если находимся на корневом пути knowledge
  useEffect(() => {
    if (pathname === '/knowledge') {
      router.push('/knowledge/courses');
    }
  }, [pathname, router]);

  const handleNozologyChange = (nozologyId: string) => {
    const params = new URLSearchParams(searchParams);
    if (nozologyId === 'all') {
      params.delete('nozologyId');
    } else {
      params.set('nozologyId', nozologyId);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEditNozology = (id: string) => {
    router.push(`/knowledge/nozologies/${id}/edit`);
  };

  const handleDeleteNozology = async (id: string) => {
    try {
      await nozologiesApi.delete(id);
      // Перезагружаем список нозологий
      await fetchNozologies({
        limit: 100
      });
      
      if (currentNozologyId === id) {
        const params = new URLSearchParams(searchParams);
        params.delete('nozologyId');
        router.push(`${pathname}?${params.toString()}`);
      }
    } catch (error) {
      console.error('Error deleting nozology:', error);
    }
  };

  const handleCreateNozology = () => {
    router.push('/knowledge/nozologies/create');
  };

  

  return (
    <div className="space-y-6">
      <div className="flex items-center pb-4 border-b border-gray-600 justify-between">
        <Tabs
          value={currentNozologyId || 'all'}
          onValueChange={handleNozologyChange}
        >
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            {Array.isArray(items) && items.map((nozology) => (
              <EntityContextMenu
                key={nozology._id?.toString()}
                onEdit={() => handleEditNozology(nozology._id?.toString() || '')}
                onDelete={() => handleDeleteNozology(nozology._id?.toString() || '')}
              >
                <TabsTrigger value={nozology._id?.toString() || ''}>
                  {nozology.name}
                </TabsTrigger>
              </EntityContextMenu>
            ))}
          </TabsList>
        </Tabs>
        <Button
          onClick={handleCreateNozology}
          size="sm"
          className="gap-2"
        >
          <Plus size={16} />
          Добавить нозологию
        </Button>
      </div>
      {children}
    </div>
  );
} 