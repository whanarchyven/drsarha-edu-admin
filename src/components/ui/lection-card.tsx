"use client"

import Image from "next/image"
import { Clock, Edit, Play, Star, Trash2, ClipboardList, CheckSquare } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getContentUrl } from "@/shared/utils/url"


interface LectureCardProps {
  id: string
  name: string
  cover_image: string
  video: string
  description: string
  duration: string
  stars: number
  feedback: {
    question: string
    answers?: { answer: string; is_correct: boolean }[]
    has_correct?: boolean
  }[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function LectureCard({
  id,
  name,
  cover_image,
  video,
  description,
  duration,
  stars,
  feedback,
  onEdit,
  onDelete,
}: LectureCardProps) {
  const [videoOpen, setVideoOpen] = useState(false)

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
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {duration} мин
          </div>

          <div className="flex items-center gap-2">
            {hasTest ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                Тест
              </Badge>
            ) : null}

<TooltipProvider>
              <Tooltip delayDuration={0.2}>
                <TooltipTrigger asChild>
                  <div>
                  <Badge variant="outline" className="flex items-center cursor-pointer gap-1">
                    <ClipboardList className="w-3 h-3" />
                    {questionCount} вопрос(ов)
                  </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] bg-white text-black shadow-lg border-slate-200 border-2">
                  <div className="space-y-2">
                    {feedback.map((q, i) => {
                        if(q.answers){
                            return (
                                <div key={i}>
                        <div className="font-medium">{q.question}</div>
                        {q.answers.length > 0 && (
                          <div className="pl-2 mt-1 text-sm">
                            {q.answers.map((a, j) => (
                              <div key={j} className="flex items-center gap-1">
                                {q.has_correct && (
                                  <div
                                    className={`w-2 h-2 rounded-full ${a.is_correct ? "bg-green-500" : "bg-red-500"}`}
                                  />
                                )}
                                {a.answer}
                              </div>
                            ))}
                          </div>
                        )}
                        {i < feedback.length - 1 && <Separator className="my-2" />}
                      </div>
                            )
                        }
                    })}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setVideoOpen(true)}>
            <Play className="w-4 h-4 mr-2" />
            Смотреть видео
          </Button>
          <Button variant="outline" size="icon" onClick={() => onEdit?.(id)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Редактировать</span>
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onDelete?.(id)}>
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Удалить</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="aspect-[16/9] relative">
            <video src={getContentUrl(video)} controls className="absolute inset-0 w-full h-full">
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

