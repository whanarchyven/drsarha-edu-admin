import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BrochureSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <Skeleton className="aspect-[3/4] w-full rounded-t-lg" />
      </CardHeader>
      <CardContent className="pt-4">
        <Skeleton className="h-6 w-3/4" />
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </CardFooter>
    </Card>
  )
}

export function BrochureSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <BrochureSkeleton key={i} />
      ))}
    </div>
  )
} 