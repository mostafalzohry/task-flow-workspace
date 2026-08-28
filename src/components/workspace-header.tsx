import { ListTodo, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface WorkspaceHeaderProps {
  onAddTask: () => void;
}

const WorkspaceHeader = ({ onAddTask }: WorkspaceHeaderProps) => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <ListTodo className="size-5" />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            TaskFlow
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize, track, and complete your team&rsquo;s work.
          </p>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full sm:w-auto"
        onClick={onAddTask}
        startIcon={<Plus />}
      >
        Add task
      </Button>
    </header>
  );
};

export default WorkspaceHeader;
