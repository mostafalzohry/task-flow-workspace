"use client";

import { useMemo } from "react";

import type { SortOrder, TaskFilters, TaskSortField } from "@/types";
import { filterTasks } from "@/utils/task-filters";
import { useTasksQuery } from "./use-tasks";

export const TASK_PAGE_SIZE = 25;

interface UseTaskListArgs extends TaskFilters {
  sortBy: TaskSortField;
  sortOrder: SortOrder;
  page: number;
  enabled: boolean;
}

export function useTaskList({
  search,
  status,
  priority,
  from,
  to,
  sortBy,
  sortOrder,
  page,
  enabled,
}: UseTaskListArgs) {
  const dateFilterActive = from !== "" || to !== "";

  const query = useTasksQuery(
    {
      search,
      status,
      priority,
      sortBy,
      sortOrder,
      ...(dateFilterActive ? {} : { page, limit: TASK_PAGE_SIZE }),
    },
    { enabled },
  );

  const rows = useMemo(() => {
    const data = query.data ?? [];
    if (!dateFilterActive) {
      return { tasks: data, hasNextPage: data.length === TASK_PAGE_SIZE };
    }
    const filtered = filterTasks(data, { search, status, priority, from, to });
    const start = (page - 1) * TASK_PAGE_SIZE;
    return {
      tasks: filtered.slice(start, start + TASK_PAGE_SIZE),
      hasNextPage: filtered.length > page * TASK_PAGE_SIZE,
    };
  }, [query.data, dateFilterActive, search, status, priority, from, to, page]);

  return {
    query,
    tasks: rows.tasks,
    hasNextPage: rows.hasNextPage,
    hasPreviousPage: page > 1,
  };
}
