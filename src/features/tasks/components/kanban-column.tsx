import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "../config";
import type { Task, TaskStatus } from "../types";
import TaskCard from "./task-card";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: readonly Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const KanbanColumn = ({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) => {
  const { label, indicatorClassName } = STATUS_META[status];
  const headingId = `column-${status}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-3"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`size-2.5 shrink-0 rounded-full ${indicatorClassName}`}
        />
        <h2 id={headingId} className="text-sm font-medium">
          {label}
        </h2>
        <Badge variant="secondary" className="ml-auto">
          {tasks.length}
        </Badge>
      </div>

      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default KanbanColumn;
