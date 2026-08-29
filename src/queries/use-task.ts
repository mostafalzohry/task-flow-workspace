"use client";

import { useQuery } from "@tanstack/react-query";

import { getTaskById } from "@/api/task-service";
import { taskKeys } from "./task-keys";

export function useTaskQuery(id: string | null) {
  return useQuery({
    queryKey: taskKeys.detail(id ?? ""),
    queryFn: () => getTaskById(id ?? ""),
    enabled: id !== null,
    staleTime: 15_000,
  });
}
