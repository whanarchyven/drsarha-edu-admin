"use client"
import Image from "next/image"
import { useState } from "react"
import { Star, Edit, Trash2, Eye, AlertCircle, CheckSquare, ClipboardList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import type { ClinicAtlas } from "@/shared/models/ClinicAtlas"
import { getContentUrl } from "@/shared/utils/url"
import { Separator } from "@/components/ui/separator"
import { TaskBadges } from "@/shared/ui/TaskBadges/TaskBadges"

interface ClinicAtlasCardProps extends ClinicAtlas {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ClinicalAtlasCard({
  _id,
  name,
  difficulty,
  cover_image,
  images,
  description,
  clinical_picture,
  additional_info,
  difficulty_type,
  ai_scenario,
  stars,
  feedback,
  nozology,
  onEdit,
  onDelete,
}: ClinicAtlasCardProps) {
  const [imagesOpen, setImagesOpen] = useState(false)
  const hasTest = feedback.some((q) => q.has_correct)
  const questionCount = feedback.length

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/9]">
            <Image src={getContentUrl(cover_image)} alt={name} fill className="object-cover" />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold leading-none tracking-tight">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex -ml-1 text-yellow-400">
            <Star
                  className={`w-4 h-4 fill-current`}
                />
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
            <strong>Клинический рисунок:</strong> {clinical_picture}
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
          <Button variant="secondary" className="flex-1" onClick={() => setImagesOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Просмотр
          </Button>
          <Button variant="outline" size="icon" onClick={() => onEdit?.(_id)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Редактировать</span>
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onDelete?.(_id)}>
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
            {images.map((img, index) => (
              <div key={index} className="relative aspect-[16/9]">
                <Image
                  src={getContentUrl(img.image)}
                  alt={`Image ${index + 1}`}
                  fill
                  className={`object-cover ${!img.is_open ? "border-4 border-red-500" : ""}`}
                />
                {!img.is_open && (
                  <div className="absolute top-2 right-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Это изображение закрыто</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

