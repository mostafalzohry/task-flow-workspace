"use client";

import { useMemo, useState } from "react";
import {
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

import { STATUS_META } from "@/config";
import { usePatchTask } from "@/queries/use-task-mutations";
import type { Task } from "@/types";
import {
  collisionDetection,
  readStatus,
  resolveColumnMove,
} from "@/utils/kanban-dnd";

const POINTER_ACTIVATION = { distance: 6 } as const;
const TOUCH_ACTIVATION = { delay: 200, tolerance: 8 } as const;

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    "Press space or enter to pick up a task. Use the arrow keys to move it between columns. Press space or enter again to drop it, or press escape to cancel.",
};

export function useKanbanDnd(tasks: readonly Task[]) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const patchTask = usePatchTask();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: POINTER_ACTIVATION }),
    useSensor(TouchSensor, { activationConstraint: TOUCH_ACTIVATION }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const titles = useMemo(
    () => new Map(tasks.map((task) => [task.id, task.title])),
    [tasks],
  );

  const announcements = useMemo<Announcements>(() => {
    const label = (id: UniqueIdentifier) => titles.get(String(id)) ?? "task";
    const columnLabel = (
      over: { data: { current?: Record<string, unknown> | null } } | null,
    ) => {
      const status = readStatus(over?.data.current);
      return status ? STATUS_META[status].label : null;
    };

    return {
      onDragStart: ({ active }) =>
        `Picked up ${label(active.id)}. Use the arrow keys to choose a column.`,
      onDragOver: ({ active, over }) => {
        const column = columnLabel(over);
        return column
          ? `${label(active.id)} is over the ${column} column.`
          : `${label(active.id)} is not over a column.`;
      },
      onDragEnd: ({ active, over }) => {
        const column = columnLabel(over);
        return column
          ? `${label(active.id)} was moved to the ${column} column.`
          : `${label(active.id)} was returned to its column.`;
      },
      onDragCancel: ({ active }) => `Moving ${label(active.id)} was cancelled.`,
    };
  }, [titles]);

  const onDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((task) => task.id === event.active.id) ?? null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const move = resolveColumnMove(event.active, event.over);
    if (move) {
      patchTask.mutate({ id: move.id, patch: { status: move.status } });
    }
  };

  const onDragCancel = () => setActiveTask(null);

  return {
    activeTask,
    sensors,
    collisionDetection,
    accessibility: { announcements, screenReaderInstructions },
    onDragStart,
    onDragEnd,
    onDragCancel,
  };
}
