import { STATUS_ORDER } from "../config";
import type { Task, TaskStatus } from "../types";
import { KanbanColumn } from "./kanban-column";

interface KanbanBoardProps {
  tasks: readonly Task[];
}

function groupByStatus(tasks: readonly Task[]): Record<TaskStatus, Task[]> {
  const groups: Record<TaskStatus, Task[]> = {
    todo: [],
    "in-progress": [],
    "in-review": [],
    done: [],
  };

  for (const task of tasks) {
    groups[task.status].push(task);
  }

  return groups;
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const grouped = groupByStatus(tasks);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STATUS_ORDER.map((status) => (
        <KanbanColumn key={status} status={status} tasks={grouped[status]} />
      ))}
    </div>
  );
}
