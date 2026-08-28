"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTasks } from "@/api/task-service";
import type { TaskListQuery } from "@/types";
import { taskKeys } from "./task-keys";

export function useTasksQuery(query: TaskListQuery) {
  return useQuery({
    queryKey: taskKeys.list(query),
    queryFn: () => getTasks(query),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}
