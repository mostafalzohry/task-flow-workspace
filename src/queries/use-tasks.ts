"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTasks } from "@/api/task-service";
import type { TaskListParams } from "@/types";
import { taskKeys } from "./task-keys";

export function useTasksQuery(
  params: TaskListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => getTasks(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
    enabled: options?.enabled ?? true,
  });
}
