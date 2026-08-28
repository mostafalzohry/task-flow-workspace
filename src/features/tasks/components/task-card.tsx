"use client";

import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Task } from "../types";
import TaskCardBody from "./task-card-body";

interface TaskCardProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const TaskCard = ({ task, onEditTask, onDeleteTask }: TaskCardProps) => {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "card", status: task.status },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={isDragging ? "opacity-40" : undefined}
    >
      <TaskCardBody
        task={task}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        dragHandle={
          <button
            ref={setActivatorNodeRef}
            type="button"
            aria-label={`Drag ${task.title}. Press space, then use the arrow keys to move it between columns.`}
            className="mt-0.5 -ml-0.5 shrink-0 cursor-grab touch-none rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-pressed:cursor-grabbing aria-pressed:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical aria-hidden="true" className="size-4" />
          </button>
        }
      />
    </div>
  );
};

export default TaskCard;
