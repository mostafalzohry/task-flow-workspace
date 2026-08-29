"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import type { DragData } from "@/utils/kanban-dnd";
import TaskCardBody from "./task-card-body";

interface TaskCardProps {
  task: Task;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const TaskCard = ({
  task,
  onViewTask,
  onEditTask,
  onDeleteTask,
}: TaskCardProps) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: { type: "card", status: task.status } satisfies DragData,
    });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      aria-label={task.title}
      className={cn(
        "cursor-grab rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isDragging && "cursor-grabbing opacity-40",
      )}
      {...attributes}
      {...listeners}
    >
      <TaskCardBody
        task={task}
        onViewTask={onViewTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
};

export default TaskCard;
