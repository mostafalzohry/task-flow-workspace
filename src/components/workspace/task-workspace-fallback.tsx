import { Skeleton } from "@/components/ui/skeleton";
import KanbanBoardSkeleton from "../board/kanban-board-skeleton";

const TaskWorkspaceFallback = () => {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-9 w-full sm:w-28" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Skeleton className="h-8 w-full sm:w-72" />
        <Skeleton className="h-8 w-full sm:w-40" />
        <Skeleton className="h-8 w-full sm:w-40" />
        <Skeleton className="h-8 w-full sm:w-40" />
        <Skeleton className="h-8 w-full sm:w-40" />
      </div>

      <KanbanBoardSkeleton />
    </div>
  );
};

export default TaskWorkspaceFallback;
