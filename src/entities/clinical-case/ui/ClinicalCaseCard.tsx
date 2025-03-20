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

import type { ClinicTask } from '@/shared/models/ClinicTask';
import { getContentUrl } from '@/shared/utils/url';
import { TaskBadges } from '@/shared/ui/TaskBadges/TaskBadges';
import { copyToClipboardWithToast } from '@/shared/utils/copyToClipboard';

interface ClinicTaskCardProps extends ClinicTask {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ClinicalCaseCard({
  _id,
  name,
  difficulty,
  cover_image,
  images,
  description,
  additional_info,
  questions,
  ai_scenario,
  stars,
  feedback,
  nozology,
  onEdit,
  onDelete,
}: ClinicTaskCardProps) {
  const [imagesOpen, setImagesOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/9]">
          <div className='grid grid-cols-2 gap-2'>
            <div className='relative aspect-[16/9]'>
              <Image src={getContentUrl(cover_image)} alt={name} fill className="object-cover" />
            </div>
            {images.map((image) => (
              <div className='relative aspect-[16/9]'>
                <Image src={getContentUrl(image.image)} alt={name} fill className="object-cover" />
                <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
                  <p className='text-white text-center'>{image.is_open ? 'Открыто' : 'Закрыто'}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="absolute top-2 right-2"
            onClick={async () => await copyToClipboardWithToast(_id as string)}>
            {_id}
          </Button>
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold leading-none tracking-tight">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{description}</p>
              
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
           
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-md font-bold">Дополнительная информация</p>
              <p className="text-sm text-muted-foreground">{additional_info}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-md font-bold">AI сценарий</p>
              <p className="text-sm text-muted-foreground">{ai_scenario}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {questions.map((question, index) => (
              <div
                className="grid grid-cols-2 gap-2 border-2 border-gray-300 rounded-md p-2"
                key={index}>
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Вопрос {index + 1}</p>
                  <p>{question.question}</p>
                  {question.image && (
                    <Image
                      src={getContentUrl(question.image)}
                      alt={question.question}
                      width={300}
                      height={300}
                    />
                  )}
                </div>
                <div className="flex p-3 flex-col gap-2">
                  <p className="text-md font-bold">Предполагаемый ответ</p>
                  {question.type === 'text' && (
                    <p>{question.answer}</p>
                  )}

                  <p className="text-md font-bold">Дополнительные указания ИИ (промпт)</p>
                  {question.type === 'text' && (
                    <p>{question.additional_info}</p>
                  )}
                  
                </div>
              </div>
            ))}
          </div>

          {additional_info && (
            <div className="text-sm">
              <strong>Дополнительно:</strong> {additional_info}
            </div>
          )}

          {ai_scenario && (
            <div className="text-sm">
              <strong>AI сценарий:</strong> {ai_scenario}
            </div>
          )}
          <div className="flex items-center gap-2">
            <TaskBadges feedback={feedback} />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          
          
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(_id as string)}>
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Удалить</span>
          </Button>
        </CardFooter>
      </Card>

      
    </>
  );
}
