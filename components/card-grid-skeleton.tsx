import { Skeleton } from "@/components/ui/skeleton";

export function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-4 w-full">
      {new Array(9).fill("").map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-[350px] rounded-md" />
    </div>
  );
}
