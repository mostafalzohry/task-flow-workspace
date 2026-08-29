import type { TaskListParams } from "@/types";

export const taskKeys = {
  all: ["tasks"] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (params: TaskListParams) =>
    [
      ...taskKeys.lists(),
      params.search,
      params.status,
      params.priority,
      params.sortBy ?? null,
      params.sortOrder ?? null,
      params.page ?? null,
      params.limit ?? null,
    ] as const,
};
