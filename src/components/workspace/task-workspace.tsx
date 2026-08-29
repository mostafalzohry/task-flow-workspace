"use client";

import { useCallback, useMemo, useState } from "react";

import { filterTasks } from "@/utils/task-filters";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { useTaskList } from "@/queries/use-task-list";
import { useTasksQuery } from "@/queries/use-tasks";
import type { Task, TaskStatus } from "@/types";
import ErrorState from "../common/error-state";
import KanbanBoard from "../board/kanban-board";
import KanbanBoardEmpty from "../board/kanban-board-empty";
import KanbanBoardSkeleton from "../board/kanban-board-skeleton";
import TablePagination from "../list/table-pagination";
import TaskTable from "../list/task-table";
import TaskTableSkeleton from "../list/task-table-skeleton";
import DeleteTaskDialog from "../task-dialogs/delete-task-dialog";
import TaskDetailsDialog from "../task-dialogs/task-details-dialog";
import TaskDialog from "../task-dialogs/task-dialog";
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
  const [detailsTaskId, setDetailsTaskId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  const openDetails = useCallback((task: Task) => {
    setDetailsTaskId(task.id);
    setDetailsOpen(true);
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
            <ErrorState
              message={
                activeQuery.error instanceof Error
                  ? activeQuery.error.message
                  : LOAD_ERROR_FALLBACK
              }
              onRetry={() => {
                void activeQuery.refetch();
              }}
              isRetrying={activeQuery.isFetching}
              className="rounded-xl border border-border bg-card px-6 py-12"
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
                    onViewTask={openDetails}
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
                  onViewTask={openDetails}
                  onEditTask={openEdit}
                  onDeleteTask={openDelete}
                  onCreateTask={openCreateInStatus}
                />
              )}
            </div>
          )}
        </main>
      </div>

      <TaskDetailsDialog
        taskId={detailsTaskId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
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
