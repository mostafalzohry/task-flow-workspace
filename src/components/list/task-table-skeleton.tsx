import { Skeleton } from "@/components/ui/skeleton";

const ROWS = [0, 1, 2, 3, 4, 5];

const TaskTableSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-border"
    >
      <div className="border-b border-border bg-muted/40 px-3 py-2.5">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-border">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center gap-4 px-3 py-3">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-8 w-36 shrink-0" />
            <Skeleton className="h-8 w-32 shrink-0" />
            <Skeleton className="hidden h-4 w-24 shrink-0 sm:block" />
            <Skeleton className="size-7 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTableSkeleton;
