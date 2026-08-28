"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
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
        <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold tracking-tight">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground">
              The application failed to load. You can try again or return to the
              workspace.
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
      </body>
    </html>
  );
};

export default GlobalError;
