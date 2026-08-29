"use client";

import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_META } from "@/config";
import type { Task, TaskStatus } from "@/types";
import type { DragData } from "@/utils/kanban-dnd";
import TaskCard from "./task-card";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: readonly Task[];
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

const KanbanColumn = ({
  status,
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
}: KanbanColumnProps) => {
  const { label, indicatorClassName } = STATUS_META[status];
  const headingId = `column-${status}`;
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status } satisfies DragData,
  });

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      data-drop-active={isOver || undefined}
      className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-3 transition-colors data-[drop-active]:border-primary data-[drop-active]:bg-primary/10 data-[drop-active]:ring-2 data-[drop-active]:ring-primary data-[drop-active]:ring-inset"
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
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={`Add a task to ${label}`}
          onClick={() => onAddTask(status)}
        >
          <Plus />
        </Button>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex min-h-14 flex-col gap-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                onViewTask={onViewTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            </li>
          ))}
        </ul>
      </SortableContext>
    </section>
  );
};

export default KanbanColumn;
