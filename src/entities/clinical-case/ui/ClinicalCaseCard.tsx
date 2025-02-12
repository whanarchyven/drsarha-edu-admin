"use client"

import Image from "next/image"
import { useState } from "react"
import { Star, Edit, Trash2, Eye, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import type { ClinicTask } from "@/shared/models/ClinicTask"
import { getContentUrl } from "@/shared/utils/url"

interface ClinicTaskCardProps extends ClinicTask {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ClinicalCaseCard({
  _id,
  name,
  difficulty,
  cover_image,
  images,
  description,
  diagnoses,
  treatment,
  additional_info,
  difficulty_type,
  ai_scenario,
  stars,
  feedback,
  nozology,
  onEdit,
  onDelete,
}: ClinicTaskCardProps) {
  const [imagesOpen, setImagesOpen] = useState(false)

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

          <div className="grid grid-cols-2 p-2 border-2 border-gray-200 rounded-lg gap-2">
            <p className="text-sm font-semibold col-span-2">Диагнозы:</p>
            {diagnoses.map((diagnosis, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant={diagnosis.is_correct ? "default" : "secondary"} className="flex flex-col gap-1 items-start p-1">
                      <p className="text-sm font-semibold">{diagnosis.name}</p>
                      <p className="text-sm ">{diagnosis.description}</p>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{diagnosis.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <div className="text-sm">
            <strong>Лечение:</strong> {treatment}
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

