import { Skeleton } from "@/components/ui/skeleton";

const TaskDetailsSkeleton = () => {
  return (
    <div aria-hidden="true" className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((cell) => (
          <div key={cell} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetailsSkeleton;
