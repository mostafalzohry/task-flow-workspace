import { RefreshCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

interface KanbanBoardErrorProps {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}

const KanbanBoardError = ({
  message,
  onRetry,
  isRetrying,
}: KanbanBoardErrorProps) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-12 text-center"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      <Button
        onClick={onRetry}
        disabled={isRetrying}
        variant="outline"
        startIcon={
          <RefreshCw className={isRetrying ? "animate-spin" : ""} />
        }
      >
        {isRetrying ? "Retrying..." : "Retry"}
      </Button>
    </div>
  );
};

export default KanbanBoardError;
