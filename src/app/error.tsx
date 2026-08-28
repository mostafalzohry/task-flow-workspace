"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorBoundary = ({ reset }: ErrorBoundaryProps) => {
  const router = useRouter();

  const goToWorkspace = () => {
    startTransition(() => {
      router.push("/");
      reset();
    });
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-lg font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error interrupted the workspace. You can try again or
          return to the workspace.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={reset} startIcon={<RotateCcw />}>
          Try again
        </Button>
        <Button variant="outline" onClick={goToWorkspace}>
          Back to workspace
        </Button>
      </div>
    </main>
  );
};

export default ErrorBoundary;
