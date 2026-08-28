import { STATUS_ORDER } from "../config";
import type { Task, TaskStatus } from "../types";
import KanbanColumn from "./kanban-column";

interface KanbanBoardProps {
  tasks: readonly Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
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

const KanbanBoard = ({ tasks, onEditTask, onDeleteTask }: KanbanBoardProps) => {
  const grouped = groupByStatus(tasks);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STATUS_ORDER.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={grouped[status]}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
