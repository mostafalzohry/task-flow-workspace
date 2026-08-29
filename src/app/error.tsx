"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

import ErrorState from "@/components/common/error-state";

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
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-4 py-16">
      <ErrorState
        size="lg"
        message="An unexpected error interrupted the workspace. You can try again or return to the workspace."
        onRetry={reset}
        secondaryAction={{ label: "Back to workspace", onClick: goToWorkspace }}
      />
    </main>
  );
};

export default ErrorBoundary;
