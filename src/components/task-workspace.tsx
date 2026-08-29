"use client";

import { useCallback, useMemo, useState } from "react";

import { filterTasks } from "@/utils/task-filters";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { useTaskList } from "@/queries/use-task-list";
import { useTasksQuery } from "@/queries/use-tasks";
import type { Task, TaskStatus } from "@/types";
import DeleteTaskDialog from "./delete-task-dialog";
import KanbanBoard from "./kanban-board";
import KanbanBoardEmpty from "./kanban-board-empty";
import KanbanBoardError from "./kanban-board-error";
import KanbanBoardSkeleton from "./kanban-board-skeleton";
import TablePagination from "./table-pagination";
import TaskDialog from "./task-dialog";
import TaskTable from "./task-table";
import TaskTableSkeleton from "./task-table-skeleton";
import TaskToolbar from "./task-toolbar";
import WorkspaceHeader from "./workspace-header";

const EMPTY_TASKS: Task[] = [];
const LOAD_ERROR_FALLBACK = "We couldn't load your tasks. Please try again.";

const TaskWorkspace = () => {
  const filters = useTaskFilters();
  const isListView = filters.view === "list";

  const boardQuery = useTasksQuery(filters.serverQuery, {
    enabled: !isListView,
  });
  const boardTasks = useMemo(
    () => filterTasks(boardQuery.data ?? EMPTY_TASKS, filters.appliedFilters),
    [boardQuery.data, filters.appliedFilters],
  );

  const list = useTaskList({
    ...filters.appliedFilters,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: filters.page,
    enabled: isListView,
  });

  const [taskDialogTask, setTaskDialogTask] = useState<Task | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState<TaskStatus>("todo");
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openCreateInStatus = useCallback((status: TaskStatus) => {
    setTaskDialogTask(null);
    setCreateStatus(status);
    setTaskDialogOpen(true);
  }, []);

  const openCreate = useCallback(
    () => openCreateInStatus("todo"),
    [openCreateInStatus],
  );

  const openEdit = useCallback((task: Task) => {
    setTaskDialogTask(task);
    setTaskDialogOpen(true);
  }, []);

  const openDelete = useCallback((task: Task) => {
    setDeleteTarget(task);
    setDeleteOpen(true);
  }, []);

  const activeQuery = isListView ? list.query : boardQuery;
  const displayTasks = isListView ? list.tasks : boardTasks;
  const isBackgroundFetching =
    activeQuery.isFetching && !activeQuery.isPending;

  return (
    <>
      <div className="flex min-w-0 flex-col gap-6">
        <WorkspaceHeader
          view={filters.view}
          onViewChange={filters.setView}
          onAddTask={openCreate}
        />

        <main className="flex min-w-0 flex-col gap-6">
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

          {activeQuery.isPending ? (
            isListView ? (
              <TaskTableSkeleton />
            ) : (
              <KanbanBoardSkeleton />
            )
          ) : activeQuery.isError ? (
            <KanbanBoardError
              message={
                activeQuery.error instanceof Error
                  ? activeQuery.error.message
                  : LOAD_ERROR_FALLBACK
              }
              onRetry={() => {
                void activeQuery.refetch();
              }}
              isRetrying={activeQuery.isFetching}
            />
          ) : displayTasks.length === 0 ? (
            isListView && filters.page > 1 ? (
              <div className="flex flex-col gap-4">
                <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
                  No tasks on this page.
                </p>
                <TablePagination
                  page={filters.page}
                  hasPreviousPage
                  hasNextPage={false}
                  onPageChange={filters.setPage}
                />
              </div>
            ) : (
              <KanbanBoardEmpty
                variant={filters.hasActiveFilters ? "no-results" : "empty"}
                onCreate={openCreate}
                onClearFilters={filters.clearFilters}
              />
            )
          ) : (
            <div
              aria-busy={isBackgroundFetching}
              className={
                activeQuery.isPlaceholderData
                  ? "min-w-0 opacity-60 transition-opacity"
                  : "min-w-0 transition-opacity"
              }
            >
              {isListView ? (
                <div className="flex flex-col gap-4">
                  <TaskTable
                    tasks={displayTasks}
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSort={filters.setSort}
                    onEditTask={openEdit}
                    onDeleteTask={openDelete}
                  />
                  <TablePagination
                    page={filters.page}
                    hasPreviousPage={list.hasPreviousPage}
                    hasNextPage={list.hasNextPage}
                    onPageChange={filters.setPage}
                  />
                </div>
              ) : (
                <KanbanBoard
                  tasks={displayTasks}
                  onEditTask={openEdit}
                  onDeleteTask={openDelete}
                  onCreateTask={openCreateInStatus}
                />
              )}
            </div>
          )}
        </main>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        task={taskDialogTask}
        createStatus={createStatus}
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
