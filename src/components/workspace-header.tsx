import { ListTodo, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TaskView } from "@/types";
import ViewToggle from "./view-toggle";

interface WorkspaceHeaderProps {
  view: TaskView;
  onViewChange: (view: TaskView) => void;
  onAddTask: () => void;
}

const WorkspaceHeader = ({
  view,
  onViewChange,
  onAddTask,
}: WorkspaceHeaderProps) => {
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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <ViewToggle view={view} onViewChange={onViewChange} />
        <Button
          size="lg"
          className="h-11 w-full px-6 text-sm sm:w-auto"
          onClick={onAddTask}
          startIcon={<Plus />}
        >
          Add task
        </Button>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
