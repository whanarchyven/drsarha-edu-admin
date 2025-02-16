import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import type { Course } from '@/shared/models/Course';
import { getContentUrl } from '@/shared/utils/url';
import { Clock, Trash2, Edit } from 'lucide-react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StagesList } from '@/components/stages-list';
import { KnowledgeBaseElementType } from '@/shared/models/types/KnowledgeBaseElementType';
import { translateKnowledgeType } from '@/shared/utils/translateKnowledgeType';
import { copyToClipboardWithToast } from '@/shared/utils/copyToClipboard';
interface CourseCardProps extends Course {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CourseCard = ({
  _id,
  name,
  cover_image,
  nozology,
  stars,
  duration,
  description,
  stages,
  onEdit,
  onDelete,
}: CourseCardProps) => {
  return (
    <Card>
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={getContentUrl(cover_image)}
          alt={name}
          fill
          className="object-cover"
        />
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
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          {duration}
        </div>
        <p className="text-sm text-muted-foreground">{stages.length} этапов</p>
        <StagesList
          stages={stages.map(
            (stage) =>
              `${translateKnowledgeType(stage.type as KnowledgeBaseElementType)} - ${stage.name}`
          )}
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" onClick={() => onEdit?.(_id as string)}>
          <Edit className="w-4 h-4" />
          <p>Редактировать</p>
        </Button>
        <Button variant="destructive" onClick={() => onDelete?.(_id as string)}>
          <Trash2 className="w-4 h-4" />
          <p>Удалить</p>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
