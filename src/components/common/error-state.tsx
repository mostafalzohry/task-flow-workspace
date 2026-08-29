import { RefreshCw, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  size?: "sm" | "lg";
  onRetry?: () => void;
  retryLabel?: string;
  isRetrying?: boolean;
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

const ErrorState = ({
  title = "Something went wrong",
  message,
  size = "sm",
  onRetry,
  retryLabel = "Try again",
  isRetrying = false,
  secondaryAction,
  className,
}: ErrorStateProps) => {
  const isLarge = size === "lg";

  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-4 text-center", className)}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-destructive/10 text-destructive",
          isLarge ? "size-12" : "size-10",
        )}
      >
        <TriangleAlert
          aria-hidden="true"
          className={isLarge ? "size-6" : "size-5"}
        />
      </span>

      <div className="space-y-1.5">
        {isLarge ? (
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        ) : (
          <p className="text-sm font-medium">{title}</p>
        )}
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>

      {onRetry || secondaryAction ? (
        <div className="flex flex-wrap justify-center gap-2">
          {onRetry ? (
            <Button
              disabled={isRetrying}
              onClick={onRetry}
              startIcon={
                <RefreshCw className={isRetrying ? "animate-spin" : ""} />
              }
            >
              {isRetrying ? "Retrying..." : retryLabel}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default ErrorState;
