"use client";

import { memo, useMemo } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import { STATUS_ORDER } from "@/config";
import { useKanbanDnd } from "@/hooks/use-kanban-dnd";
import type { Task, TaskStatus } from "@/types";
import { groupByStatus } from "@/utils/task-grouping";
import KanbanColumn from "./kanban-column";
import TaskCardBody from "./task-card-body";

interface KanbanBoardProps {
  tasks: readonly Task[];
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onCreateTask: (status: TaskStatus) => void;
}

const KanbanBoard = ({
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onCreateTask,
}: KanbanBoardProps) => {
  const grouped = useMemo(() => groupByStatus(tasks), [tasks]);
  const {
    activeTask,
    sensors,
    collisionDetection,
    accessibility,
    onDragStart,
    onDragEnd,
    onDragCancel,
  } = useKanbanDnd(tasks);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={accessibility}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={grouped[status]}
            onViewTask={onViewTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onCreateTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <TaskCardBody
            task={activeTask}
            onViewTask={onViewTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            isOverlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default memo(KanbanBoard);
