import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_ORDER } from "../config";

const TaskCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
};

const KanbanBoardSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {STATUS_ORDER.map((status) => (
        <div
          key={status}
          className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-3"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="size-2.5 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-5 w-6 rounded-full" />
          </div>
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export default KanbanBoardSkeleton;
