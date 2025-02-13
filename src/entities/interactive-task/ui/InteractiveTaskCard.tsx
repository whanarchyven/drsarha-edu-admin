'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Star, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { InteractiveTask } from '@/shared/models/InteractiveTask';
import { getContentUrl } from '@/shared/utils/url';
import { TaskBadges } from '@/shared/ui/TaskBadges/TaskBadges';

interface InteractiveTaskCardProps extends InteractiveTask {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function InteractiveTaskCard({
  _id,
  name,
  difficulty,
  cover_image,
  answers,
  difficulty_type,
  available_errors,
  feedback,
  nozology,
  stars,
  onEdit,
  onDelete,
}: InteractiveTaskCardProps) {
  const [imagesOpen, setImagesOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/9]">
          <Image
            src={getContentUrl(cover_image)}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold leading-none tracking-tight">
                {name}
              </h3>
            </div>
            <div className="flex -ml-1 text-yellow-400">
              <Star className={`w-4 h-4 fill-current`} />
              <p className="text-sm text-black">{stars}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Сложность: {difficulty}/10</Badge>
            <Badge variant="outline">{difficulty_type}</Badge>
          </div>
          <div className="text-sm">
            <strong>Доступно ошибок:</strong> {available_errors}
          </div>
          <div className="flex items-center gap-2">
            <TaskBadges feedback={feedback} />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setImagesOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Просмотр
          </Button>
          <Button variant="outline" size="icon" onClick={() => onEdit?.(_id)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Редактировать</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete?.(_id)}>
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Удалить</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={imagesOpen} onOpenChange={setImagesOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{name} - Изображения</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {answers.map((img, index) => (
              <div key={index} className="relative flex flex-col gap-2 w-full">
                <div className="relative aspect-square w-full">
                  <Image
                    src={getContentUrl(img.image)}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="p-2 border rounded-lg">
                  <p className="text-sm font-medium">{img.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
