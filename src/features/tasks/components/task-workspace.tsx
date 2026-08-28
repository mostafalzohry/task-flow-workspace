"use client";

import { useMemo, useState } from "react";

import { filterTasks } from "../utils/task-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useTasksQuery } from "../queries/use-tasks";
import type { Task } from "../types";
import DeleteTaskDialog from "./delete-task-dialog";
import KanbanBoard from "./kanban-board";
import KanbanBoardEmpty from "./kanban-board-empty";
import KanbanBoardError from "./kanban-board-error";
import KanbanBoardSkeleton from "./kanban-board-skeleton";
import TaskDialog from "./task-dialog";
import TaskToolbar from "./task-toolbar";
import WorkspaceHeader from "./workspace-header";

const EMPTY_TASKS: Task[] = [];
const LOAD_ERROR_FALLBACK = "We couldn't load your tasks. Please try again.";

const TaskWorkspace = () => {
  const filters = useTaskFilters();
  const tasksQuery = useTasksQuery(filters.serverQuery);

  const [taskDialogTask, setTaskDialogTask] = useState<Task | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const tasks = tasksQuery.data ?? EMPTY_TASKS;
  const visibleTasks = useMemo(
    () => filterTasks(tasks, filters.appliedFilters),
    [tasks, filters.appliedFilters],
  );

  const openCreate = () => {
    setTaskDialogTask(null);
    setTaskDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setTaskDialogTask(task);
    setTaskDialogOpen(true);
  };

  const openDelete = (task: Task) => {
    setDeleteTarget(task);
    setDeleteOpen(true);
  };

  const isBackgroundFetching = tasksQuery.isFetching && !tasksQuery.isPending;

  return (
    <>
      <div className="flex flex-col gap-6">
        <WorkspaceHeader onAddTask={openCreate} />

        <main className="flex flex-col gap-6">
          <TaskToolbar
            searchInput={filters.searchInput}
            onSearchChange={filters.setSearchInput}
            status={filters.status}
            onStatusChange={filters.setStatus}
            priority={filters.priority}
            onPriorityChange={filters.setPriority}
            from={filters.from}
            onFromChange={filters.setFrom}
            to={filters.to}
            onToChange={filters.setTo}
            dateRangeError={filters.dateRangeError}
            hasActiveFilters={filters.hasActiveFilters}
            onClearFilters={filters.clearFilters}
            isFetching={isBackgroundFetching}
          />

          {tasksQuery.isPending ? (
            <KanbanBoardSkeleton />
          ) : tasksQuery.isError ? (
            <KanbanBoardError
              message={
                tasksQuery.error instanceof Error
                  ? tasksQuery.error.message
                  : LOAD_ERROR_FALLBACK
              }
              onRetry={() => {
                void tasksQuery.refetch();
              }}
              isRetrying={tasksQuery.isFetching}
            />
          ) : visibleTasks.length === 0 ? (
            <KanbanBoardEmpty
              variant={
                tasks.length === 0 && !filters.hasActiveFilters
                  ? "empty"
                  : "no-results"
              }
              onCreate={openCreate}
              onClearFilters={filters.clearFilters}
            />
          ) : (
            <div
              aria-busy={isBackgroundFetching}
              className={
                tasksQuery.isPlaceholderData
                  ? "opacity-60 transition-opacity"
                  : "transition-opacity"
              }
            >
              <KanbanBoard
                tasks={visibleTasks}
                onEditTask={openEdit}
                onDeleteTask={openDelete}
              />
            </div>
          )}
        </main>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        task={taskDialogTask}
        onOpenChange={setTaskDialogOpen}
      />
      <DeleteTaskDialog
        open={deleteOpen}
        task={deleteTarget}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
};

export default TaskWorkspace;
