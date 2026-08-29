"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

import ErrorState from "@/components/common/error-state";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ reset }: GlobalErrorProps) => {
  const router = useRouter();

  const goToWorkspace = () => {
    startTransition(() => {
      router.push("/");
      reset();
    });
  };

  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-4 py-16">
          <ErrorState
            size="lg"
            message="The application failed to load. You can try again or return to the workspace."
            onRetry={reset}
            secondaryAction={{
              label: "Back to workspace",
              onClick: goToWorkspace,
            }}
          />
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
