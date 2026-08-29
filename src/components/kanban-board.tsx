"use client";

import { memo, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  Announcements,
  DragEndEvent,
  DragStartEvent,
  ScreenReaderInstructions,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { STATUS_META, STATUS_ORDER } from "@/config";
import { usePatchTask } from "@/queries/use-task-mutations";
import type { Task, TaskStatus } from "@/types";
import { collisionDetection, readStatus } from "@/utils/kanban-dnd";
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

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    "Press space or enter to pick up a task. Use the arrow keys to move it between columns. Press space or enter again to drop it, or press escape to cancel.",
};

const KanbanBoard = ({
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onCreateTask,
}: KanbanBoardProps) => {
  const grouped = useMemo(() => groupByStatus(tasks), [tasks]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const patchTask = usePatchTask();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const titles = useMemo(
    () => new Map(tasks.map((task) => [task.id, task.title])),
    [tasks],
  );

  const taskLabel = (id: UniqueIdentifier): string =>
    titles.get(String(id)) ?? "task";

  const targetColumnLabel = (
    over: { data: { current?: Record<string, unknown> | null } } | null,
  ): string | null => {
    const status = readStatus(over?.data.current);
    return status ? STATUS_META[status].label : null;
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `Picked up ${taskLabel(active.id)}. Use the arrow keys to choose a column.`,
    onDragOver: ({ active, over }) => {
      const column = targetColumnLabel(over);
      return column
        ? `${taskLabel(active.id)} is over the ${column} column.`
        : `${taskLabel(active.id)} is not over a column.`;
    },
    onDragEnd: ({ active, over }) => {
      const column = targetColumnLabel(over);
      return column
        ? `${taskLabel(active.id)} was moved to the ${column} column.`
        : `${taskLabel(active.id)} was returned to its column.`;
    },
    onDragCancel: ({ active }) =>
      `Moving ${taskLabel(active.id)} was cancelled.`,
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((task) => task.id === event.active.id) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) {
      return;
    }
    const fromStatus = readStatus(active.data.current);
    const toStatus = readStatus(over.data.current);
    if (!fromStatus || !toStatus || fromStatus === toStatus) {
      return;
    }
    patchTask.mutate({ id: String(active.id), patch: { status: toStatus } });
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{ announcements, screenReaderInstructions }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
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
